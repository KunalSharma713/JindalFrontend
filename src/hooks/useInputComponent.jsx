import { useState } from "react";

// Custom hook to manage form input and feedback.
const useInputComponent = (feedtype = "none", feedmessage = "") => {
  // State to store the value entered by the user.
  const [enteredValue, setEnteredValue] = useState("");
  
  // State to store the feedback message.
  const [feedbackMessage, setFeedbackMessage] = useState(feedmessage);
  
  // State to store the type of feedback message (e.g., success, error).
  const [messageType, setMessageType] = useState(feedtype);
  
  // State to track if the input field has been touched (i.e., interacted with).
  const [isTouched, setIsTouched] = useState(false);
  
  // Reset function to clear the input field, reset touch state, and set feedback message back to default or passed value.
  const reset = (message = "") => {
    // Clear the entered value.
    setEnteredValue("");
    
    // Reset the touched state to false.
    setIsTouched(false);
    
    // Reset the feedback message to the default or a new message.
    setFeedbackMessage((message === "" ? feedmessage : message));
    
    // Reset the message type to the default or provided type.
    setMessageType(feedtype);
  };
  
  // Return an object containing all the state variables and methods for managing them.
  return {
    enteredValue,
    setEnteredValue,
    isTouched,
    setIsTouched,
    feedbackMessage,
    setFeedbackMessage,
    messageType,
    setMessageType,
    reset,
  };
};

export default useInputComponent;
