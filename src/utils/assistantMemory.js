let messages = [
    {
        id: 1,
        sender: "assistant",
        text: "Hi! I'm your Vision Tracker Assistant. I can help you with your goals, tasks and progress."
    }
];

export const getAssistantMessages = () => {
    return messages;
};

export const updateAssistantMessages = (newMessages) => {
    messages = newMessages;
};

export const resetAssistantMessages = () => {
    messages = [
        {
            id: Date.now(),
            sender: "assistant",
            text: "Hi! I'm your Vision Tracker Assistant. I can help you with your goals, tasks and progress."
        }
    ];
};