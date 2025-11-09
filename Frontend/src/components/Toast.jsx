import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react"; // ✅ ícones modernos (já disponíveis no shadcn/lucide-react)

export default function Toast({ message, type = "info" }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 3000); // desaparece em 3s
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    const config = {
        success: {
            color: "bg-green-500",
            icon: <CheckCircle className="w-5 h-5 text-white" />,
        },
        error: {
            color: "bg-red-500",
            icon: <XCircle className="w-5 h-5 text-white" />,
        },
        info: {
            color: "bg-blue-500",
            icon: <Info className="w-5 h-5 text-white" />,
        },
    };

    const { color, icon } = config[type] || config.info;

    return (
        <div
            className={`
                fixed top-4 right-4 flex items-center gap-3 
                text-white px-4 py-3 rounded-lg shadow-lg
                ${color} animate-fade-in-out z-50
            `}
        >
            {icon}
            <span className="font-medium">{message}</span>
        </div>
    );
}
