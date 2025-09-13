import os
from typing import Optional
import logging

try:
    from googletrans import Translator
    GOOGLE_TRANSLATE_AVAILABLE = True
except ImportError:
    GOOGLE_TRANSLATE_AVAILABLE = False

logger = logging.getLogger(__name__)

class TranslationService:
    def __init__(self):
        self.translator = None
        if GOOGLE_TRANSLATE_AVAILABLE:
            try:
                self.translator = Translator()
                logger.info("✅ Translation service initialized")
            except Exception as e:
                logger.warning(f"⚠️ Translation service initialization failed: {e}")
        else:
            logger.warning("⚠️ Google Translate not available. Install with: pip install googletrans==3.1.0a0")
        
        # Common Hindi translations for farming terms
        self.common_translations = {
            'tomato': 'टमाटर',
            'onion': 'प्याज', 
            'potato': 'आलू',
            'wheat': 'गेहूं',
            'rice': 'चावल',
            'cotton': 'कपास',
            'sugarcane': 'गन्ना',
            'maize': 'मक्का',
            'mustard': 'सरसों',
            'gram': 'चना',
            'farmer': 'किसान',
            'price': 'कीमत',
            'listing': 'सूची',
            'bid': 'बोली',
            'delivery': 'डिलीवरी',
            'payment': 'भुगतान',
            'thank you': 'धन्यवाद',
            'welcome': 'स्वागत है'
        }
    
    async def translate(self, text: str, source_lang: str = 'en', target_lang: str = 'hi') -> str:
        """
        Translate text from source language to target language
        Falls back to common translations if Google Translate fails
        """
        try:
            # If no translation needed
            if source_lang == target_lang:
                return text
            
            # Try common translations first for key terms
            if target_lang == 'hi' and source_lang == 'en':
                lower_text = text.lower()
                for english, hindi in self.common_translations.items():
                    if english in lower_text:
                        text = text.replace(english, hindi)
                        text = text.replace(english.title(), hindi)
            
            # Use Google Translate if available
            if self.translator and len(text) > 50:  # Only for longer texts
                try:
                    result = self.translator.translate(text, src=source_lang, dest=target_lang)
                    return result.text
                except Exception as e:
                    logger.warning(f"Google Translate failed: {e}")
            
            return text
            
        except Exception as e:
            logger.error(f"Translation error: {e}")
            return text  # Return original text if translation fails
    
    def get_crop_local_name(self, crop_name: str, language: str = 'hi') -> str:
        """Get local name for crop"""
        if language == 'hi':
            return self.common_translations.get(crop_name.lower(), crop_name)
        return crop_name
    
    def is_supported_language(self, lang_code: str) -> bool:
        """Check if language is supported"""
        supported_languages = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'mr', 'pa']
        return lang_code in supported_languages