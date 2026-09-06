import {
    useState,
    useRef,
    useEffect
} from "react";

import {
    getAssistantMessages,
    updateAssistantMessages
} from "../../utils/assistantMemory.js";

import api from "../../api/api.js";

import ReactMarkdown from "react-markdown";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

import "./Assistant.css";


function Assistant() {

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState(
        getAssistantMessages()
    );

    const [isGenerating, setIsGenerating] = useState(false);

    const messagesEndRef = useRef(null);


    /*
     * AUTO SCROLL
     *
     * Whenever a new message appears,
     * scroll to the bottom.
     */
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages, isGenerating]);


    /*
     * LOGOUT LISTENER
     *
     * When Navbar logs out:
     *
     * 1. Clear assistant memory.
     * 2. Clear current assistant state.
     */
    useEffect(() => {

        const handleLogout = () => {

            const initialMessage = {
                id: Date.now(),
                sender: "assistant",
                text: "Hi! I'm your Vision Tracker Assistant. I can help you with your goals, tasks and progress."
            };

            /*
             * Clear previous user's chat
             * from memory.
             */
            updateAssistantMessages([
                initialMessage
            ]);

            /*
             * Reset UI state.
             */
            setMessages([
                initialMessage
            ]);

            setMessage("");

            setIsGenerating(false);
        };


        window.addEventListener(
            "userLogout",
            handleLogout
        );


        return () => {

            window.removeEventListener(
                "userLogout",
                handleLogout
            );

        };

    }, []);


    /*
     * SEND MESSAGE
     */
    const handleSendMessage = async () => {

        if (!message.trim() || isGenerating) {
            return;
        }


        const userMessage = message.trim();


        /*
         * Create user message.
         */
        const newUserMessage = {

            id: Date.now(),

            sender: "user",

            text: userMessage

        };


        /*
         * Add user message immediately.
         */
        setMessages((previousMessages) => {

            const updatedMessages = [
                ...previousMessages,
                newUserMessage
            ];


            /*
             * Save conversation memory.
             */
            updateAssistantMessages(
                updatedMessages
            );


            return updatedMessages;

        });


        /*
         * Clear input.
         */
        setMessage("");


        try {

            /*
             * Show typing animation.
             */
            setIsGenerating(true);


            /*
             * Send request to backend.
             */
            const response = await api.post(

                "/assistant/chat/1",

                {
                    message: userMessage
                }

            );


            console.log(
                "Assistant API response:",
                response.data
            );


            /*
             * Backend returns:
             *
             * {
             *     message: "AI response..."
             * }
             *
             * So we use response.data.message.
             */
            const assistantMessage = {

                id: Date.now() + 1,

                sender: "assistant",

                text: response.data.message

            };


            /*
             * Add AI response.
             */
            setMessages((previousMessages) => {

                const updatedMessages = [

                    ...previousMessages,

                    assistantMessage

                ];


                /*
                 * Save complete conversation.
                 */
                updateAssistantMessages(
                    updatedMessages
                );


                return updatedMessages;

            });


        } catch (error) {

            console.error(
                "Assistant API error:",
                error
            );


            /*
             * Show error message.
             */
            const errorMessage = {

                id: Date.now() + 1,

                sender: "assistant",

                text:
                    "Sorry, your Today's free access is over. See you tomorrow!"

            };


            setMessages((previousMessages) => {

                const updatedMessages = [

                    ...previousMessages,

                    errorMessage

                ];


                updateAssistantMessages(
                    updatedMessages
                );


                return updatedMessages;

            });


        } finally {

            /*
             * Hide typing animation.
             */
            setIsGenerating(false);

        }

    };


    /*
     * SEND WITH ENTER
     */
    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleSendMessage();

        }

    };


    return (

        <div className="assistant-page">


            <Sidebar />


            <div className="assistant-main">


                <Navbar />


                <main className="assistant-content">


                    <div className="assistant-chat">


                        {/* CHAT HEADER */}

                        <div className="chat-header">

                            <div className="chat-header-icon">
                                🤖
                            </div>

                            <span className="chat-header-title">
                                VT Assistant
                            </span>

                        </div>


                        {/* MESSAGES */}

                        <div className="chat-messages">


                            {messages.map(
                                (chatMessage) => (

                                    <div
                                        key={chatMessage.id}
                                        className={`chat-message ${
                                            chatMessage.sender === "user"
                                                ? "user-message"
                                                : "assistant-message"
                                        }`}
                                    >


                                        {/* AI AVATAR */}

                                        {chatMessage.sender === "assistant" && (

                                            <div className="message-avatar">
                                                🤖
                                            </div>

                                        )}


                                        {/* MESSAGE */}

                                        <div className="message-bubble">

                                            {chatMessage.sender === "assistant" ? (

                                                <ReactMarkdown>
                                                    {chatMessage.text}
                                                </ReactMarkdown>

                                            ) : (

                                                chatMessage.text

                                            )}

                                        </div>

                                    </div>

                                )
                            )}


                            {/* AI GENERATING */}

                            {isGenerating && (

                                <div className="chat-message assistant-message">


                                    <div className="message-avatar">
                                        🤖
                                    </div>


                                    <div className="typing-indicator">

                                        <span></span>

                                        <span></span>

                                        <span></span>

                                    </div>

                                </div>

                            )}


                            <div
                                ref={messagesEndRef}
                            />

                        </div>


                        {/* INPUT */}

                        <div className="chat-input-area">


                            <textarea
                                value={message}
                                onChange={(event) =>
                                    setMessage(
                                        event.target.value
                                    )
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="Ask VT Assistant..."
                                rows="1"
                                disabled={isGenerating}
                            />


                            <button
                                className="send-message-btn"
                                onClick={handleSendMessage}
                                disabled={
                                    !message.trim() ||
                                    isGenerating
                                }
                                aria-label="Send message"
                            >

                                ➤

                            </button>

                        </div>

                    </div>

                </main>

            </div>

        </div>

    );

}

export default Assistant;

