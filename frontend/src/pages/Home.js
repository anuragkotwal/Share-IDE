/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import toast from "react-hot-toast";
import "../TailwindCSS/output.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import shareIDE from "../../src/shareIDE.svg";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = Math.random().toString(36).substring(2, 7);
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = async () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & username is required");
      return;
    }

    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/user/save`,{
      username,
      roomId,
    })

    if(!response.data.success){
      toast.error(response.data.message);
      return;
    }


    // Redirect
    navigate(`/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };
  return (
    <div className="landingPageWrapper">
      {/* <div className=" justify-start text-white font-medium text-2xl pl-4 pt-3">
        <img className="h-6 inline-block -mt-2" src={shareIDE} alt="" />{" "}
        ShareIDE
      </div> */}
      <div className="homePageWrapper">
        <div className=" mx-auto text-white font-medium text-4xl pt-3 mb-8">
          <img className="h-10 inline-block -mt-2" src={shareIDE} alt="" />{" "}
          ShareIDE
        </div>
        <div className="formWrapper">
          <h4 className="mainLabel text-[#30353E] font-medium">
            Paste invitation Room Id
          </h4>
          <div className="inputGroup">
            <input
              type="text"
              className="inputBox text-[#30353E] font-medium"
              placeholder="Room Id"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              onKeyUp={handleInputEnter}
            />
            <input
              type="text"
              className="inputBox text-[#30353E] font-medium"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              onKeyUp={handleInputEnter}
            />
            <button
              className="btn joinBtn text-[#ffffff] font-medium"
              onClick={joinRoom}>
              Join
            </button>
            <span className="createInfo font-normal text-[#30353E] text-sm">
              If you don't have an invite then create a&nbsp;
              <a onClick={createNewRoom} href="" className="createNewBtn">
                new room
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
