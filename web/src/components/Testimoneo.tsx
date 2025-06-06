import React from "react";
import './Testimoneo.css';

interface TestimoneoProps {
    text: string;
    name: string;
    date: string;
}

const Testimoneo: React.FC<TestimoneoProps> = ({ text, name, date }) => {
    return (
        <div className="testimoneo-card">
            <div className="testimoneo-avatar">
                <div className="avatar-placeholder">Foto</div>
            </div>
            <div className="testimoneo-content">
                <p className="testimoneo-text">{text}</p>
                <div className="testimoneo-footer">
                    <span className="testimoneo-name">{name}</span>
                    <span className="testimoneo-date">{date}</span>
                </div>
            </div>
        </div>
    );
};

export default Testimoneo;

