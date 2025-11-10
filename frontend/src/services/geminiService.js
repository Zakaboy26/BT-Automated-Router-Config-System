import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const geminiService = {
    generateResponse: async (message) => {
        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-pro"
            });
            
            const prompt = `As a BT IoT Router Services assistant, provide a direct response about: ${message}

            Key Information:
            1. Orders & Tracking:
            - Submit router requests at http://localhost:3000/router-requests
            - Track orders at http://localhost:3000/track-order
            - Order reference numbers sent via email (check junk folder)
            - Modifications/cancellations allowed until order approval
            - Production time: 3-5 business days
            - Delivery time: 5-7 business days

            2. Support & Contact:
            - Email: iot.support@bt.com
            - Phone: 0800-123-4567
            - Hours: Monday-Friday, 9am-6pm GMT
            - Help guide available with video tutorials available at http://localhost:3000/help
            - Issue reporting form: http://localhost:3000/user-report
            - Standing order customers can submit feedback through the same form

            Keep responses concise, friendly, and under 100 words.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini API Error:', error);
            
            // Fallback responses based on keywords
            if (message.toLowerCase().includes('router')) {
                return "To submit a router request, visit http://localhost:3000/router-requests. Orders take 3-5 business days for production and 5-7 days for delivery. You can modify or cancel your order until it's approved.";
            } else if (message.toLowerCase().includes('track')) {
                return "You can track your order at http://localhost:3000/track-order where you can enter your reference number. Check your email (including junk folder) for the reference. Order statuses include: Pending, Confirmed, In Production, Quality Check, Ready for Shipping, In Transit, and Delivered.";
            } else if (message.toLowerCase().includes('support') || message.toLowerCase().includes('contact')) {
                return "Our support team is available Monday-Friday, 9am-6pm GMT. Contact us via email at iot.support@bt.com or call us at 0800-123-4567. For urgent issues, please use our issue reporting form at http://localhost:3000/user-report";
            } else if (message.toLowerCase().includes('issue') || message.toLowerCase().includes('report')) {
                return "To report an issue or provide feedback, please use our form at http://localhost:3000/user-report. Both regular and standing order customers can use this form. You'll receive a report reference number for tracking.";
            } else if (message.toLowerCase().includes('status') || message.toLowerCase().includes('update')) {
                return "Order status updates are sent via email. You can also check your order status at http://localhost:3000/track-order. Status updates include: Pending, Confirmed, In Production, Quality Check, Ready for Shipping, In Transit, and Delivered.";
            } else if (message.toLowerCase().includes('modify') || message.toLowerCase().includes('change')) {
                return "You can modify your order until it's approved. Visit http://localhost:3000/track-order and use your reference number to make changes. Modifications are not allowed once the order enters production.";
            } else if (message.toLowerCase().includes('cancel')) {
                return "You can cancel your order until it's approved. Visit http://localhost:3000/track-order and use your reference number to cancel. Cancellations are not allowed once the order enters production.";
            } else if (message.toLowerCase().includes('history') || message.toLowerCase().includes('past')) {
                return "You can view your order history at http://localhost:3000/order-history. This includes all your past router requests and their statuses.";
            } else if (message.toLowerCase().includes('reorder')) {
                return "You can reorder a router from your order history. Visit http://localhost:3000/order-history and select the order you wish to reorder. This will create a new order with the same specifications.";
            } else if (message.toLowerCase().includes('email') || message.toLowerCase().includes('notification')) {
                return "You'll receive email notifications for: order confirmation, status updates, modifications, cancellations, and delivery. Please check your spam/junk folder if you don't receive these emails.";
            } else if (message.toLowerCase().includes('time') || message.toLowerCase().includes('delivery')) {
                return "Standard processing times: 3-5 business days for production, 5-7 business days for delivery. Priority orders may be processed faster. You'll receive email updates throughout the process.";
            } else if (message.toLowerCase().includes('priority') || message.toLowerCase().includes('urgent')) {
                return "Priority levels can be set when placing your order. Higher priority orders may be processed faster, but standard processing times still apply: 3-5 business days for production, 5-7 business days for delivery.";
            } else if (message.toLowerCase().includes('vlan') || message.toLowerCase().includes('configuration')) {
                return "VLAN configurations and other router settings can be specified when placing your order. For technical support with configurations, please contact our support team at iot.support@bt.com";
            } else if (message.toLowerCase().includes('refund') || message.toLowerCase().includes('payment')) {
                return "Refunds are processed within 3-5 business days after order cancellation. For payment-related queries, please contact our support team at iot.support@bt.com or call 0800-123-4567";
            }
            
            return "I apologize, but I'm having technical difficulties. Please contact our support team at iot.support@bt.com or call 0800-123-4567.";
        }
    }
};

export default geminiService; 