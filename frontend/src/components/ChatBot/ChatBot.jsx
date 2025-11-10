import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    IconButton,
    Typography,
    Fade,
    Tooltip,
    Divider,
    Button,
    TextField,
    CircularProgress,
    Link
} from '@mui/material';
import {
    Chat as ChatIcon,
    Close as CloseIcon,
    Send as SendIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import geminiService from '../../services/geminiService';
import BTLogoImage from '../../assets/BT_logo_white.png';

const ChatButton = styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    backgroundColor: '#6200aa',
    color: 'white',
    '&:hover': {
        backgroundColor: '#4b0082',
    },
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
}));

const ChatWindow = styled(Paper)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    width: '350px',
    height: '600px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1001,
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: '#6200aa',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
    maxWidth: '80%',
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: isUser ? '#6200aa' : '#f5f5f5',
    color: isUser ? 'white' : 'text.primary',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    wordBreak: 'break-word',
}));

const QuickResponseButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1.5),
    textTransform: 'none',
    borderRadius: '20px',
    backgroundColor: '#f5f5f5',
    color: '#6200aa',
    '&:hover': {
        backgroundColor: '#e0e0e0',
    },
    fontSize: '0.85rem',
}));

const BTLogo = styled('img')({
    width: '24px',
    height: '24px',
    marginRight: '8px'
});

const MessageText = styled(Typography)(({ theme }) => ({
    '& a': {
        color: 'inherit',
        textDecoration: 'underline',
        '&:hover': {
            opacity: 0.8
        }
    }
}));

const quickResponses = [
    "How do I submit a router request?",
    "How do I track my order?",
    "How do I contact support?",
    "How do I report an issue?"
];

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{
        text: "Hello! I'm your BT IoT Router Services assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date()
    }]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const convertUrlsToLinks = (text) => {
        // Regex to match URLs starting with http://, https://, or www.
        const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(bt\.com\/[^\s]+)/g;
        
        const parts = text.split(urlRegex);
        if (parts.length === 1) return text;

        return parts.map((part, index) => {
            if (!part) return null;
            if (part.match(urlRegex)) {
                let url = part;
                if (part.startsWith('www.')) {
                    url = 'http://' + part;
                }
                return (
                    <Link 
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part}
                    </Link>
                );
            }
            return part;
        });
    };

    const handleMessage = async (message, isQuickResponse = false) => {
        if (!message.trim() || isLoading) return;
        setIsLoading(true);

        setMessages(prev => [...prev, {
            text: message,
            isUser: true,
            timestamp: new Date()
        }]);

        if (!isQuickResponse) setInputMessage('');

        try {
            const response = await geminiService.generateResponse(message);
            setMessages(prev => [...prev, {
                text: response,
                isUser: false,
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Tooltip title="Chat with Support">
                <ChatButton onClick={() => setIsOpen(true)} disabled={isOpen}>
                    <ChatIcon />
                </ChatButton>
            </Tooltip>

            <Fade in={isOpen}>
                <ChatWindow>
                    <ChatHeader>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BTLogo src={BTLogoImage} alt="BT Logo" />
                            <Typography variant="h6">BT Support Assistant</Typography>
                        </Box>
                        <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </ChatHeader>

                    <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {messages.map((message, index) => (
                            <MessageBubble key={index} isUser={message.isUser}>
                                <MessageText variant="body2">
                                    {convertUrlsToLinks(message.text)}
                                </MessageText>
                                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7, fontSize: '0.7rem' }}>
                                    {message.timestamp.toLocaleTimeString()}
                                </Typography>
                            </MessageBubble>
                        ))}
                        <div ref={messagesEndRef} />
                    </Box>

                    <Divider />

                    <Box sx={{ p: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.5, backgroundColor: '#f8f8f8' }}>
                        {quickResponses.map((response, index) => (
                            <QuickResponseButton
                                key={index}
                                variant="outlined"
                                size="small"
                                onClick={() => handleMessage(response, true)}
                                disabled={isLoading}
                            >
                                {response}
                            </QuickResponseButton>
                        ))}
                    </Box>

                    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Type your message..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleMessage(inputMessage)}
                            disabled={isLoading}
                        />
                        <IconButton
                            onClick={() => handleMessage(inputMessage)}
                            disabled={!inputMessage.trim() || isLoading}
                            sx={{ color: '#6200aa' }}
                        >
                            {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                        </IconButton>
                    </Box>
                </ChatWindow>
            </Fade>
        </>
    );
};

export default ChatBot;