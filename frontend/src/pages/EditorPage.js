import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import axios from 'axios';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import "../TailwindCSS/output.css";
import shareIDE from "../../src/shareIDE.svg";
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';
import Chat from "../components/Chat"

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [savePerm, setSavePerm] = useState(false);
    const [theme, setTheme] = useState("dracula");
    let themeState = "dracula";

    const savePermission = async () => {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/getusers`,
          {
            params: {
              roomId: roomId,
              username: location.state?.username,
            },
          }
        );
        if (response.data.success) {
          // eslint-disable-next-line react-hooks/exhaustive-deps, array-callback-return
          if(response.data.data.role === "0") {
              setSavePerm(true);
          }else{
              setSavePerm(false);
          }
        }
      };

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => console.log(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });
            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        savePermission();
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketRef,savePerm]);
  
    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    async function saveCode() {
        socketRef.current.emit(ACTIONS.SAVE, {
            code: codeRef.current,
            roomId
        });
        toast.success(`File saved.`);
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }



      const runCode = () => {
        const input = document.getElementById("input").value || '';
        const code = codeRef.current;
        let languageSelect = document.getElementById("language")
        toast.loading("Running Code....");
        const data={
            'code':code,
            'language':languageSelect.value,
            'input':input,
        }
    
        const options = {
          method: 'POST',
          url: 'https://api.codex.jaagrav.in',
          data: data,
        };    
        axios
          .request(options)
          .then(function (response) {
            if(response.data.error !== "")
            {
                toast.dismiss();
                toast.error("Code compilation unsuccessful");
                document.getElementById("output").value = response.data.error;
            }
            else if(response.data.output !== "")
            {
                toast.dismiss();
                toast.success("Code compiled successfully");
                document.getElementById("output").value = response.data.output;
            }
          })
          .catch(function (error) {
            toast.dismiss();
            toast.error("Code compilation unsuccessful");
            document.getElementById("output").value =
              "Something went wrong, Please check your code and input.";
          });
      };

    function handleTheme(){
        let themeSelect = document.getElementById("theme");
        setTheme(themeSelect.value);
        themeState = themeSelect.value;

        let editorWindow = document.getElementById("realtimeEditor");
        let themeCSS = `CodeMirror cm-s-${themeState}`;
        editorWindow.nextSibling.setAttribute("class", themeCSS);
    }


    return (
        
        <div className="mainWrap">

            <div className="aside">
                <div className="asideInner">
                    <div className="logo flex">
                        <div className=' self-center text-white font-medium text-2xl mx-auto'>
                            <img className='h-6 inline-block -mt-2' src={shareIDE} alt="" /> ShareIDE
                        </div>
                    </div>
                    <h3 className='mt-1 mb-2 font-medium text-base'>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            client.username = client.username[0].toUpperCase() + client.username.slice(1),
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>

                <div className='h-8 flex rounded-sm '>
                    <div className='rounded-sm w-30 self-center flex'>
                    <span className='font-medium block mr-2'>Theme</span>
                        <select disabled={!savePerm} name="theme" id="theme" onChange={handleTheme} className=' ml-6 block h-7 bg-[#30353E]/80 outline-none rounded-md text-slate-100 w-30'>
                            <option value="dracula" selected>Dracula</option>
                            <option value="3024-night">3024-night</option>
                            <option value="elegant">Elegant</option>
                            <option value="twilight">Twilight</option>
                            <option value="vibrant-ink">Vibrant-ink</option>
                            <option value="monokai">Monokai</option>
                            <option value="midnight">Midnight</option>
                            <option value="shadowfox">Shadowfox</option>
                            <option value="seti">Seti</option>
                            <option value="solarized">Solarized</option>
                        </select>
                    </div>
                </div>

                <div className='h-8 flex rounded-sm'>
                    <div className='rounded-sm w-30 self-center flex'>
                    <span className='font-medium block mr-2'>Language</span>
                        <select disabled={!savePerm} name="language" id="language" className='block h-7 bg-[#30353E]/80 outline-none rounded-md text-slate-100 w-[7rem]'>
                            <option value="cs">C#</option>
                            <option value="java">Java</option>
                            <option value="py">Python</option>
                            <option value="c">C (gcc)</option>
                            <option value="cpp" selected>C++ (gcc)</option>
                            <option value="js">JavaScript</option>
                            <option value="go">GoLang</option>
                        </select>
                    </div>
                </div>

                <button className="font-medium hover:text-[#ec3360] transition-all duration-300 mt-8" onClick={copyRoomId}>
                    Copy Room Id
                </button>   

                <button className="btn leaveBtn bg-[#1d9e62] hover:bg-[#198754]" onClick={runCode} disabled={!savePerm}>
                    Run Code
                </button>

                <button className="btn leaveBtn" onClick={saveCode} disabled={!savePerm}>
                    Save
                </button>

                <button className="btn leaveBtn" onClick={leaveRoom}>
                    Leave
                </button>

            </div>
            <div className="">
                <div className=''>
                    <Editor
                        socketRef={socketRef}
                        roomId={roomId}
                        username={location.state?.username}
                        onCodeChange={(code) => {
                            codeRef.current = code;
                        }}
                    />
                </div>

                <div className=' w-auto h-[18vh] bg-[#384862] IO-container flex'>
                    <div className="input_area flex-row w-1/2">
                        <label id="inputLabel" className='text-[#F7F7F7] ml-2'>
                            Input
                        </label>

                        <textarea
                        id="input"
                        className="inputArea p-2 h-[14vh] rounded-md textarea-style block w-full bg-[#F7F7F7] outline-none text-[#282A36]"
                        placeholder="Enter your input here"
                        ></textarea>
                    </div>

                    <div className="output_area flex-row  w-1/2 border-l-[#384862] border-l-4">
                        <label id="outputLabel" className='text-[#F7F7F7] ml-2'>
                            Output
                        </label>

                        <textarea
                        readOnly
                        id="output"
                        className="outputArea p-2 h-[14vh] rounded-md textarea-style block w-full bg-[#F7F7F7] outline-none bor"
                        placeholder="Output will reflect here"
                        ></textarea>
                    </div>
                </div>
            </div>
            <Chat socket={socketRef}
                roomId={roomId}
                username={location.state?.username}
            ></Chat>
        </div>
    );
};

export default EditorPage;
