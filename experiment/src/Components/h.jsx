import React, { useState, useEffect } from 'react';
import "./h.css"
import k from "./shuttle.svg"

const LoadingScreen = () => {
  const [data, setData] = useState(null);
  const [threadi, setThreadi] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [input, setInput] = useState('');
  const [ai, setAi] = useState('');
  const [editedIndex, setEditedIndex] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [initial, setInitial] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/threads", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          name: "Hello"
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        setThreadi(Object.keys(responseData)[0]);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Text copied to clipboard');
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };

  const sendData = async () => {
    try {
      const response = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          id: threadi.toString(),
          name: "Hello",
          input: input,
          ai: ai
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    if (data && threadi) {
      const selectedData = data[threadi];
      setSelectedThread(selectedData);
    }
  }, [data, threadi]);

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleAi = (e) => {
    setAi(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendData();
      setInput('');
    }
  };

  const handleEditInput = (e) => {
    setEditInput(e.target.value);
  };

  const handleEditClick = async (index) => {
    try {
      const selectedItem = selectedThread[index];
      const response = await fetch("http://localhost:5000/update", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          id: threadi.toString(),
          index: index,
          input: editInput,
          ai: selectedItem.ai
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        setData({ ...data, [threadi]: responseData });
      } else {
        throw new Error('Failed to update data');
      }
    } catch (error) {
      console.error('Error updating data:', error.message);
    }
  };

  const handleEditClick1 = (index) => {
    setEditedIndex(index);
    setEditInput(selectedThread[index].input);
    setInitial(selectedThread[index].input);
  };

  return (
    <div className='coloredbg' style={{ height: "100vh", display: "flex" }}>
      <div className='example' style={{ width: "250px", height: "100%", background: "black", color: "aliceblue", overflow: "auto" }}>
        <div className='element' style={{ display: "flex", marginBottom: "10px", marginLeft: "10px", animation: "bg-pan-left 8s both" }}>
          <img src={k} style={{ width: "50px", height: "50px", marginTop: "20px", marginLeft: "10px", marginBottom: "20px" }} alt="SVG Image" />
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: "25px", fontWeight: "100", marginTop: "30px", marginLeft: "5px" }}>Strings</div>
        </div>

        {data && Object.keys(data).map((key) => (
          <div className='fade-in example backgroundbd1' style={{ paddingLeft: "15px", marginBottom: "30px", marginRight: "10px", borderRadius: "25px", marginLeft: "10px", height: "200px", overflow: "auto" }} onClick={() => setThreadi(key)} key={key}>
            <div>{key}</div>
            {data[key].map((item) => (
              <div key={item._id}>
                <p>Input: {item.input}</p>
                <p>AI: {item.ai}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className='example' style={{ height: "calc(100% - 40px)", flex: 1, overflow: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", position: "relative", overflow: "auto" }}>
          <div style={{ marginLeft: "40px", marginTop: "30px" }}>
            {selectedThread && (
              <div className='fade-in' style={{ color: "aliceblue" }}>
                <h1>{threadi}</h1>
                <div>
                  {selectedThread.map((item, index) => (
                    <div key={item._id} style={{ width: "1150px" }}>
                      {editedIndex === index ? (
                        <textarea
                          className='example'
                          value={editInput}
                          onChange={handleEditInput}
                          style={{
                            borderRadius: "25px",
                            padding: "30px",
                            width: item.input.length > 200 ? "600px" : "400px",
                            outline: "none",
                            height: item.input.length > 100 ? "400px" : "auto",
                            backgroundColor: "aliceblue",
                            overflow: "auto"
                          }}
                        />
                      ) : (
                        <p>Input: {item.input}</p>
                      )}
                      <p>AI: {item.ai}</p>
                      <div style={{ display: "flex" }}>
                        <div onClick={() => { handleCopy(item.ai) }} style={{ height: "40px", width: "40px", backgroundColor: "black", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", marginRight: "10px" }}>
                          <i className="bi bi-files" style={{ color: "white" }}></i>
                        </div>
                        <div style={{ height: "40px", minWidth: "40px", width: "auto", backgroundColor: "black", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                          {editedIndex === index ? (
                            <span onClick={() => { handleEditClick(index); setEditedIndex(null) }}>edit</span>
                          ) : (
                            <i onClick={() => handleEditClick1(index)} className="bi bi-pencil"></i>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='bac' style={{ width: window.innerWidth - 250, position: "absolute", bottom: 0, height: "150px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <textarea value={input} onKeyDown={handleKeyDown} onChange={handleInput} className='coloredbg example' placeholder='Please enter your prompt' style={{ paddingTop: "20px", marginBottom: "20px", color: "aliceblue", paddingLeft: "40px", outline: "none", border: "none", height: "70px", width: "700px", borderRadius: "25px", overflow: "auto" }} />
          <div onClick={() => { handleCopy(input) }} style={{ height: "40px", width: "40px", backgroundColor: "black", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <i className="bi bi-files" style={{ color: "white" }}></i>
          </div>
          <div style={{ height: "30px", textAlign: "center", width: "100%", position: "absolute", bottom: 0, color: "aliceblue" }}>Please use the code with caution</div>
        </div>
        <div className={`spinner ${data !== null ? 'fade-out' : ''}`} style={{ marginLeft: "400px", marginTop: "300px" }}>
          {/* Spinner */}
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
