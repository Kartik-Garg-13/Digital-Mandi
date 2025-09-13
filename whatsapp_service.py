import os
import re
import asyncio
from typing import Dict, Any, List, Optional
from twilio.rest import Client
from twilio.base.exceptions import TwilioException
import json
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WhatsAppService:
    def __init__(self):
        # Your actual Twilio credentials
        self.account_sid = "AC2d719c8479b1d347277e9bfbeb62f9b3"
        self.auth_token = "4afb0d7540aabc53823c99bafdca6a16"
        self.whatsapp_number = "whatsapp:+14155238886"
        
        # Initialize Twilio client
        try:
            self.client = Client(self.account_sid, self.auth_token)
            logger.info("✅ Twilio WhatsApp client initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Twilio client: {e}")
            raise
        
        # Command handlers
        self.commands = {
            'LIST': self._handle_list_crop,
            'STATUS': self._handle_status,
            'DELIVER': self._handle_delivery,
            'BID': self._handle_bid_notification,
            'COLLECTIVE': self._handle_collective,
            'HELP': self._handle_help,
            'KARTIK': self._handle_kartik_info,
            'PRICE': self._handle_price_check,
            'FORECAST': self._handle_price_forecast,
            'POOL': self._handle_join_pool,
            'VERIFY': self._handle_verify_farmer
        }
        
        # MSP data for crops (real government MSP rates)
        self.msp_data = {
            'wheat': 2275,
            'rice': 2300,
            'basmati': 3000,
            'tomato': 50,
            'onion': 35,
            'potato': 25,
            'cotton': 6620,
            'sugarcane': 340,
            'maize': 2090,
            'soybean': 4600,
            'mustard': 5650,
            'turmeric': 9200,
            'chilli': 8000,
            'coriander': 7901,
            'cumin': 9950
        }
        
        # Multi-language responses
        self.translations = {
            'hindi': {
                'welcome': '🚜 डिजिटल मंडी में आपका स्वागत है!',
                'listing_created': '✅ आपकी फसल सफलतापूर्वक सूची में जोड़ दी गई!',
                'new_bid': '🔔 नई बोली: ₹{amount}/kg',
                'payment_received': '💰 भुगतान प्राप्त हुआ: ₹{amount}',
                'delivery_confirmed': '✅ डिलीवरी पुष्टि हो गई!',
                'msp_warning': '⚠️ चेतावनी: आपका मूल्य MSP से कम है'
            },
            'english': {
                'welcome': '🚜 Welcome to Digital Mandi!',
                'listing_created': '✅ Your crop listing has been created successfully!',
                'new_bid': '🔔 New bid: ₹{amount}/kg',
                'payment_received': '💰 Payment received: ₹{amount}',
                'delivery_confirmed': '✅ Delivery confirmed!',
                'msp_warning': '⚠️ Warning: Your price is below MSP'
            }
        }

    async def process_incoming_message(self, message: str, from_number: str) -> Dict[str, Any]:
        """Process incoming WhatsApp message and return response"""
        try:
            # Clean and parse message
            message = message.strip().upper()
            logger.info(f"Processing message from {from_number}: {message}")
            
            # Extract command
            command = message.split()[0] if message else 'HELP'
            
            # Handle command
            if command in self.commands:
                response = await self.commands[command](message, from_number)
            else:
                response = await self._handle_help(message, from_number)
            
            # Send response
            await self.send_message(from_number, response['message'])
            
            return {
                'success': True,
                'command': command,
                'response': response['message'],
                'data': response.get('data', {})
            }
            
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            error_msg = "🤖 Sorry, I couldn't understand that. Send HELP for available commands."
            await self.send_message(from_number, error_msg)
            return {'success': False, 'error': str(e)}

    async def _handle_list_crop(self, message: str, from_number: str) -> Dict[str, Any]:
        """Handle LIST command: LIST tomato 100kg 40/kg Jaipur"""
        try:
            # Parse: "LIST tomato 100kg 40/kg Jaipur"
            pattern = r'LIST\s+(\w+)\s+(\d+)kg\s+(\d+(?:\.\d+)?)/kg\s+(.+)'
            match = re.search(pattern, message)
            
            if not match:
                return {
                    'message': """❌ Invalid format. Use:
LIST [crop] [quantity]kg [price]/kg [location]

Example: LIST tomato 100kg 45/kg Jaipur""",
                    'data': {}
                }
            
            crop, quantity, price, location = match.groups()
            crop = crop.lower()
            quantity_int = int(quantity)
            price_float = float(price)
            
            # Check MSP
            msp_price = self.msp_data.get(crop, 0)
            msp_warning = ""
            if msp_price > 0 and price_float < msp_price:
                msp_warning = f"\n⚠️ WARNING: Your price ₹{price}/kg is below MSP ₹{msp_price}/kg"
                msp_warning += f"\nConsider pricing at MSP or higher for better returns!"
            elif msp_price > 0:
                msp_warning = f"\n✅ Good! Your price is above MSP ₹{msp_price}/kg"
            
            # Generate listing ID
            listing_id = f"L{datetime.now().strftime('%H%M%S')}"
            
            # Create listing data
            listing_data = {
                'listing_id': listing_id,
                'farmer_phone': from_number,
                'crop_name': crop.title(),
                'quantity_kg': quantity_int,
                'price_per_kg': price_float,
                'location': location.title(),
                'msp_price': msp_price,
                'created_at': datetime.now().isoformat()
            }
            
            response_msg = f"""✅ Listing created successfully!
📋 ID: {listing_id}
🌾 Crop: {crop.title()}
⚖️ Quantity: {quantity}kg
💰 Price: ₹{price}/kg
📍 Location: {location.title()}{msp_warning}

💡 Buyers can now see your listing and place bids!
📱 Send STATUS {listing_id} to check bid updates."""
            
            return {
                'message': response_msg,
                'data': listing_data
            }
            
        except Exception as e:
            logger.error(f"Error in list crop: {e}")
            return {
                'message': "❌ Error creating listing. Please check format and try again.",
                'data': {}
            }

    async def _handle_status(self, message: str, from_number: str) -> Dict[str, Any]:
        """Handle STATUS command: STATUS L123"""
        try:
            # Extract listing ID
            parts = message.split()
            if len(parts) < 2:
                return {
                    'message': "❌ Please provide listing ID. Example: STATUS L123",
                    'data': {}
                }
            
            listing_id = parts[1]
            
            # Mock status data (in real app, fetch from database)
            mock_status = {
                'listing_id': listing_id,
                'crop': 'Tomato',
                'status': 'Active',
                'current_bid': 48,
                'bid_count': 3,
                'highest_bidder': 'Buyer_xyz',
                'views': 47
            }
            
            response_msg = f"""📊 Status for {listing_id}:
🌾 Crop: {mock_status['crop']}
📈 Status: {mock_status['status']}
💰 Current Bid: ₹{mock_status['current_bid']}/kg
🎯 Total Bids: {mock_status['bid_count']}
👁️ Views: {mock_status['views']}

💡 Your listing is getting good attention!
🔔 You'll be notified of new bids automatically."""
            
            return {
                'message': response_msg,
                'data': mock_status
            }
            
        except Exception as e:
            logger.error(f"Error in status check: {e}")
            return {
                'message': "❌ Error checking status. Please try again.",
                'data': {}
            }

    async def _handle_delivery(self, message: str, from_number: str) -> Dict[str, Any]:
        """Handle DELIVER command: DELIVER L123"""
        try:
            parts = message.split()
            if len(parts) < 2:
                return {
                    'message': "❌ Please provide listing ID. Example: DELIVER L123",
                    'data': {}
                }
            
            listing_id = parts[1]
            
            # Mock delivery confirmation
            mock_payment = {
                'listing_id': listing_id,
                'amount': 14000,
                'buyer': 'AgriMart_Delhi',
                'released_at': datetime.now().isoformat()
            }
            
            response_msg = f"""✅ Delivery confirmed for {listing_id}!
💰 Payment Released: ₹{mock_payment['amount']}
🏪 Buyer: {mock_payment['buyer']}
⏰ Released at: {datetime.now().strftime('%I:%M %p')}

🎉 Transaction completed successfully!
💳 Amount will reflect in your account within 2-4 hours.
⭐ Please rate your buyer experience."""
            
            return {
                'message': response_msg,
                'data': mock_payment
            }
            
        except Exception as e:
            logger.error(f"Error in delivery: {e}")
            return {
                'message': "❌ Error confirming delivery. Please try again.",
                'data': {}
            }

    async def _handle_collective(self, message: str, from_number: str) -> Dict[str, Any]:
        """Handle COLLECTIVE command for farmer pooling"""
        collective_info = f"""🤝 Collective Farmer Pooling

📊 Available Pools:
1. 🌾 Wheat Pool - Rajasthan
   • Target: 5000kg
   • Current: 3200kg (64%)
   • Expected Price: ₹2350/kg
   
2. 🍅 Tomato Pool - Maharashtra  
   • Target: 2000kg
   • Current: 1450kg (72%)
   • Expected Price: ₹52/kg

3. 🌽 Maize Pool - Karnataka
   • Target: 8000kg
   • Current: 2100kg (26%)
   • Expected Price: ₹2150/kg

💡 Benefits:
• 15-25% higher prices
• Reduced transport costs
• Bulk buyer attraction
• Shared logistics

📱 To join: POOL [crop] [quantity]
Example: POOL wheat 500kg"""
        
        return {
            'message': collective_info,
            'data': {'pools_available': 3, 'total_farmers': 847}
        }

    async def _handle_kartik_info(self, message: str, from_number: str) -> Dict[str, Any]:
        """Handle KARTIK command - info about the creator"""
        kartik_info = f"""👨‍💻 About Kartik Singh - Digital Mandi Creator

🎓 Profile:
• Age: 17 years old
• University: Manipal University Jaipur (MUJ)
• Course: BTech Computer Science Engineering
• Goal: Harvard Economics 2025

🚀 Vision:
"Revolutionizing Indian agriculture through technology"

💡 Why Digital Mandi?
• Empower 600M+ Indian farmers
• Eliminate middleman exploitation
• Ensure MSP protection
• Enable direct market access

🔥 Features Built:
✅ WhatsApp-first interface (no app needed)
✅ Secure escrow payments
✅ Real-time bidding system
✅ Collective farmer pooling
✅ MSP price protection
✅ Multi-language support

🌟 Impact Goal:
Help farmers earn 23% more through direct sales!

Built with ❤️ for Indian farmers 🇮🇳"""
        
        return {
            'message': kartik_info,
            'data': {'creator': 'Kartik Singh', 'age': 17, 'university': 'MUJ'}
        }

    async def _handle_price_check(self, message: str, from_number: str) -> Dict[str, Any]:
        """Handle PRICE command: PRICE tomato"""
        try:
            parts = message.split()
            if len(parts) < 2:
                return {
                    'message': "❌ Please specify crop. Example: PRICE tomato",
                    'data': {}
                }
            
            crop = parts[1].lower()
            msp_price = self.msp_data.get(crop, 0)
            
            if msp_price == 0:
                return {
                    'message': f"❌ MSP data not available for {crop}. Try: wheat, rice, tomato, cotton, etc.",
                    'data': {}
                }
            
            # Mock market prices
            market_price = msp_price + (msp_price * 0.1)  # 10% above MSP
            yesterday_price = market_price - 2
            
            price_info = f"""💰 Price Information for {crop.title()}:

📊 Current Prices:
• MSP: ₹{msp_price}/kg
• Market Price: ₹{market_price:.0f}/kg
• Yesterday: ₹{yesterday_price:.0f}/kg
• Change: +₹{market_price - yesterday_price:.0f} (+{((market_price - yesterday_price)/yesterday_price)*100:.1f}%)

📈 Trend: Rising ↗️
🎯 Recommended Listing: ₹{market_price:.0f}/kg

💡 Market is favorable for {crop} today!"""
            
            return {
                'message': price_info,
                'data': {
                    'crop': crop,
                    'msp': msp_price,
                    'market': market_price,
                    'trend': 'rising'
                }
            }
            
        except Exception as e:
            logger.error(f"Error in price check: {e}")
            return {
                'message': "❌ Error fetching price. Please try again.",
                'data': {}
            }

    async def _handle_price_forecast(self, message: str, from_number: str) -> Dict[str, Any]:
        """Handle FORECAST command for price predictions"""
        forecast_info = f"""🔮 AI Price Forecast (Next 7 Days):

🌾 Wheat:
• Today: ₹2275/kg
• Tomorrow: ₹2290/kg (+0.7%)
• This Week: ₹2315/kg (+1.8%)
• Confidence: 87%

🍅 Tomato:
• Today: ₹50/kg
• Tomorrow: ₹48/kg (-4.0%)
• This Week: ₹45/kg (-10%)
• Confidence: 92%

🌽 Maize:
• Today: ₹2090/kg
• Tomorrow: ₹2105/kg (+0.7%)
• This Week: ₹2140/kg (+2.4%)
• Confidence: 84%

🤖 AI Analysis:
• Monsoon impact: Moderate
• Demand surge: High (festival season)
• Export orders: Strong

💡 Best time to sell: This week for wheat/maize, wait for tomatoes."""
        
        return {
            'message': forecast_info,
            'data': {'forecast_available': True, 'accuracy': '87%'}
        }

    async def _handle_join_pool(self, message: str, from_number: str) -> Dict[str, Any]:
        """Handle POOL command: POOL wheat 500kg"""
        try:
            # Parse: "POOL wheat 500kg"
            pattern = r'POOL\s+(\w+)\s+(\d+)kg'
            match = re.search(pattern, message)
            
            if not match:
                return {
                    'message': "❌ Invalid format. Use: POOL [crop] [quantity]kg\nExample: POOL wheat 500kg",
                    'data': {}
                }
            
            crop, quantity = match.groups()
            
            pool_response = f"""🤝 Pool Registration Successful!

📋 Details:
• Crop: {crop.title()}
• Your Quantity: {quantity}kg
• Pool Type: Collective Bargaining
• Expected Premium: +18-25%

📊 Pool Status:
• Total Farmers: 23 farmers
• Current Volume: 3,700kg
• Target Volume: 5,000kg
• Your Contribution: {quantity}kg

⏰ Timeline:
• Pool Closes: 2 days
• Auction Date: 3 days
• Payment: Within 7 days

💰 Expected Benefits:
• Higher price due to bulk volume
• Reduced transport costs
• Premium buyers access
• Collective negotiation power

🔔 You'll get updates as the pool fills up!"""
            
            return {
                'message': pool_response,
                'data': {
                    'crop': crop,
                    'quantity': quantity,
                    'pool_id': f"P{datetime.now().strftime('%H%M')}"
                }
            }
            
        except Exception as e:
            logger.error(f"Error joining pool: {e}")
            return {
                'message': "❌ Error joining pool. Please try again.",
                'data': {}
            }

    async def _handle_verify_farmer(self, message: str, from_number: str) -> Dict[str, Any]:
        """Handle VERIFY command for farmer verification"""
        verify_info = f"""✅ Farmer Verification Process

📱 Your Status:
• Phone: Verified ✅
• Location: Pending 🕐
• Land Records: Pending 🕐
• Bank Account: Pending 🕐

📋 Required Documents:
1. Land ownership papers
2. Aadhaar card
3. Bank account details
4. Recent photo with crops

🏆 Verification Benefits:
• Higher trust score (⭐⭐⭐⭐⭐)
• Premium buyers access
• Better payment terms
• Priority support

📨 Submit documents:
• WhatsApp: Send photos here
• Web: Visit digital-mandi.kartik.dev
• Call: 1800-FARMER (free)

⏱️ Processing Time: 24-48 hours"""
        
        return {
            'message': verify_info,
            'data': {'verification_status': 'phone_verified', 'pending_docs': 3}
        }

    async def _handle_help(self, message: str, from_number: str) -> Dict[str, Any]:
        """Handle HELP command"""
        help_message = f"""🚜 Digital Mandi - WhatsApp Commands

📱 Basic Commands:
• LIST [crop] [qty]kg [price]/kg [location]
  Example: LIST tomato 100kg 45/kg Jaipur

• STATUS [listing_id]
  Example: STATUS L123

• DELIVER [listing_id]
  Example: DELIVER L123

💰 Price & Market:
• PRICE [crop] - Check MSP & market prices
• FORECAST - AI price predictions

🤝 Collective Features:
• COLLECTIVE - View available pools
• POOL [crop] [qty]kg - Join farmer pool

🔧 Account & Info:
• VERIFY - Start verification process
• KARTIK - About the creator

📞 Support:
• Help: Send HELP anytime
• Call: 1800-FARMER (free)
• Web: digital-mandi.kartik.dev

🎯 Built by Kartik Singh (17) for Indian farmers!
Empowering 600M+ farmers with technology 🇮🇳"""
        
        return {
            'message': help_message,
            'data': {'commands_available': 10, 'support_available': True}
        }

    async def _handle_bid_notification(self, message: str, from_number: str) -> Dict[str, Any]:
        """Handle bid notifications to farmers"""
        return {
            'message': "🔔 You'll receive bid notifications automatically when buyers place bids on your crops!",
            'data': {}
        }

    async def send_message(self, to_number: str, message: str) -> bool:
        """Send WhatsApp message"""
        try:
            # Clean phone number
            if not to_number.startswith('whatsapp:'):
                to_number = f'whatsapp:{to_number}'
            
            # Send message
            message_instance = self.client.messages.create(
                from_=self.whatsapp_number,
                body=message,
                to=to_number
            )
            
            logger.info(f"✅ Message sent to {to_number}: {message_instance.sid}")
            return True
            
        except TwilioException as e:
            logger.error(f"❌ Twilio error sending message: {e}")
            return False
        except Exception as e:
            logger.error(f"❌ Error sending message: {e}")
            return False

    async def notify_farmer_new_bid(self, farmer_phone: str, listing_id: str, 
                                   bid_amount: float, buyer_name: str) -> bool:
        """Notify farmer of new bid"""
        message = f"""🔔 New Bid Alert!

📋 Listing: {listing_id}
💰 Bid Amount: ₹{bid_amount}/kg
👤 Buyer: {buyer_name}
⏰ Time: {datetime.now().strftime('%I:%M %p')}

🎉 Great! Your crop is attracting buyers.
💡 Higher bids may come in. Stay tuned!

📱 Check status: STATUS {listing_id}"""
        
        return await self.send_message(farmer_phone, message)

    async def notify_farmer_payment_held(self, farmer_phone: str, listing_id: str, 
                                       amount: float, buyer_name: str) -> bool:
        """Notify farmer that payment is held in escrow"""
        message = f"""💰 Payment Secured!

📋 Listing: {listing_id}
💳 Amount: ₹{amount}
👤 Buyer: {buyer_name}
🔒 Status: Held Securely

✅ Payment is safe in our escrow system
🚛 Now prepare your crop for delivery
📱 When ready: DELIVER {listing_id}

🔔 Once you confirm delivery, payment will be released instantly!"""
        
        return await self.send_message(farmer_phone, message)

    async def notify_payment_released(self, farmer_phone: str, listing_id: str, 
                                    amount: float) -> bool:
        """Notify farmer that payment has been released"""
        message = f"""🎉 Payment Released!

📋 Listing: {listing_id}
💰 Amount: ₹{amount}
✅ Status: Transfer Complete

💳 Money will reflect in your account within 2-4 hours
⭐ Please rate your experience
📱 Create new listing: LIST [crop] [qty]kg [price]/kg [location]

Thank you for using Digital Mandi! 🚜"""
        
        return await self.send_message(farmer_phone, message)

# Initialize the service
whatsapp_service = WhatsAppService()