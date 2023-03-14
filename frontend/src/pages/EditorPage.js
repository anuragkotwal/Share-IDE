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

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [savePerm, setSavePerm] = useState(false);
    const [theme, setTheme] = useState("dracula");

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
        console.log(codeRef.current)
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



    function handleTheme(){
        let themeSelect = document.getElementById("theme");
        setTheme(themeSelect.value);
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
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>

                <button className="font-medium hover:text-[#ec3360] transition-all duration-300" onClick={copyRoomId}>
                    Copy Room Id
                </button>

                <button className="btn leaveBtn" onClick={saveCode} disabled={!savePerm}>
                    Save
                </button>

                <button className="btn leaveBtn" onClick={leaveRoom}>
                    Leave
                </button>
            </div>
            <div className="editorWrap">
                <div className='h-8 flex bg-slate-100 rounded-xl '>
                    <div className='ml-10 rounded-sm w-56 self-center flex'>
                        <span className='text-[#30353E]/80 font-medium block mr-2'>Theme</span>
                        <select name="theme" id="theme" onChange={handleTheme} className='block h-7 bg-[#30353E]/80 outline-none rounded-md text-slate-100 w-56'>
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
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    username={location.state?.username}
                    themee={theme}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </div>
        </div>
    );
};

export default EditorPage;
