import { useEffect } from "react";

const Chatbot = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://embed.tawk.to/6994aacd1b1f6f1c3383596b/1jhmbmda7";
        script.charset = "UTF-8";
        script.setAttribute("crossorigin", "*");

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null;
};

export default Chatbot;
