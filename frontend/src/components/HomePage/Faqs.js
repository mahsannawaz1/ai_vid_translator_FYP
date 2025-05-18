import React, { useState } from 'react';
import './Faqs.css';

const faqs = [
    {
        question: 'How do I auto-translate a video?',
        answer: 'Simply upload your video, choose the desired output language, and our AI will automatically generate the translated version.'
    },
    {
        question: 'Can I translate an audio file?',
        answer: 'Currently, translation is only supported for video files. Audio translation functionality will be added in future updates.'
    },
    {
        question: 'How can I translate a YouTube video?',
        answer: 'Download the YouTube video first, then upload it to our platform for translation.'
    },
    {
        question: 'Is it possible to translate videos in all languages?',
        answer: 'At the moment, our platform supports translation from English to Urdu. More language options will be added soon.'
    },
    {
        question: 'How do I download the translated video?',
        answer: 'After the translation process is completed, you will be redirected to a download page where you can get the translated video with one click.'
    },
    {
        question: 'Do I need to provide subtitles to translate a video?',
        answer: 'No, our AI automatically detects and transcribes speech from the video, even if subtitles are not provided.'
    },
    {
        question: 'Is the translation 100% accurate?',
        answer: 'While our AI strives for high accuracy, results may vary based on audio clarity and language complexity. Manual editing is recommended for professional use.'
    }
];

function Faqs({faqRef}) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (i) => {
        setOpenIndex(openIndex === i ? null : i);
    };

    return (
        <div className="faq-wrapper" ref={faqRef}>
        <h2 className="faq-title">FAQs on Pixel AI Video Translator</h2>
        {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggle(index)}>
                {faq.question} <span>{openIndex === index ? '▴' : '▾'}</span>
            </div>
            {openIndex === index && <div className="faq-answer">{faq.answer}</div>}
            </div>
        ))}
        </div>
    );
}
export default Faqs;