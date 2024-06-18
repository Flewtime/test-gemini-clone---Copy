
import { createContext, useState } from 'react'
import run from './../config/gemini';

export const Context = createContext()

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    //typing related things
    const delayPara = (index, nextWord) => {
        setTimeout(function (){
            setResultData(prev=>prev+nextWord)
        },75*index)
    }

    const newChat = () => {
        setShowResult(false)
        setLoading(false)
    }


    const onSent = async(prompt) =>{
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt !== undefined){
            response = await run(prompt)
            setRecentPrompt(prompt)
        } else{
            setPrevPrompt(prev=>[...prev,input])
            setRecentPrompt(input)
            response = await run(input)
        }

        let responseArray = response.split("**");
        let newResponse="";

        for(let i =0; i < responseArray.length; i++){
            if(i === 0 || i%2 !== 1){
                newResponse += responseArray[i];
            } else{
                newResponse += "<b>"+responseArray[i]+"</b>";
            }
        }
        let otherNewResponse = newResponse.split("*").join("</br>");
        let newResponseArray = otherNewResponse.split(" ");
        for(let i=0; i<newResponseArray.length; i++){
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ");
        }
        setLoading(false)
        setInput("")
    }


    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        input,
        setInput,
        recentPrompt,
        setRecentPrompt,
        showResult,
        setShowResult,
        loading,
        setLoading,
        resultData,
        setResultData,
        onSent,
        newChat
    }


    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider