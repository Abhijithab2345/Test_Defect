import json
import time
import logging
from typing import Optional, Dict, Any
from openai import OpenAI
import base64
import re

from app.config import settings

logger = logging.getLogger(__name__)


class OpenAIAdapter:
    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is not set in environment variables")
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL
        self.gpt4_1_model = "gpt-4.1"  # GPT-4.1 model

    def _extract_json_from_response(self, text: str) -> Optional[Dict[str, Any]]:
        """Extract JSON from the model response, handling markdown code blocks."""
        # Try to find JSON in markdown code blocks
        json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass
        
        # Try to find JSON object directly
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(0))
            except json.JSONDecodeError:
                pass
        
        # If no JSON found, return None
        return None

    def _normalize_response(self, raw_response: str) -> Dict[str, Any]:
        """Normalize the model response into the standard format."""
        # Try to extract JSON from response
        json_data = self._extract_json_from_response(raw_response)
        
        if json_data:
            return {
                "image_understanding": json_data.get("image_understanding", ""),
                "detected_defects": json_data.get("detected_defects", ""),
                "root_cause": json_data.get("root_cause", ""),
                "severity": json_data.get("severity", "").lower() if json_data.get("severity") else None,
                "recommendations": json_data.get("recommendations", ""),
                "confidence": str(json_data.get("confidence", "")) if json_data.get("confidence") else None,
            }
        
        # If JSON extraction failed, try to parse the text response
        # This is a fallback - ideally the model should return JSON
        return {
            "image_understanding": raw_response[:500] if raw_response else "",
            "detected_defects": "",
            "root_cause": "",
            "severity": None,
            "recommendations": "",
            "confidence": None,
            "error": "Failed to parse structured response from model"
        }

    def _prepare_image(self, image_url: str) -> Dict[str, Any]:
        """Prepare image for OpenAI API."""
        # Check if it's a base64 data URL
        if image_url.startswith("data:image"):
            # Extract base64 data
            header, encoded = image_url.split(",", 1)
            # Extract image format from header (e.g., "data:image/jpeg;base64")
            image_format = header.split("/")[1].split(";")[0]
            
            return {
                "type": "image_url",
                "image_url": {
                    "url": image_url
                }
            }
        else:
            # Regular URL
            return {
                "type": "image_url",
                "image_url": {
                    "url": image_url
                }
            }

    def analyze(self, image_url: str, description: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyze an image using OpenAI GPT-4o.
        
        Args:
            image_url: URL or base64 data URL of the image
            description: Optional description text
            
        Returns:
            Normalized response dictionary
        """
        start_time = time.time()
        
        try:
            # Prepare the prompt
            prompt = """You are a highly accurate defect detection expert.

Analyze the provided image and user description.

Your tasks:
1. Identify object/environment in the image.
2. Detect any visible defects, damages, irregularities.
3. Explain likely root cause.
4. Provide severity level: low, medium, or high.
5. Give precise recommendations for what to do next.
6. Give a confidence score between 0 to 1.

Return output in this JSON format only:

{
  "image_understanding": "",
  "detected_defects": "",
  "root_cause": "",
  "severity": "",
  "recommendations": "",
  "confidence": ""
}"""

            if description:
                prompt += f"\n\nUser Description: {description}"

            # Prepare messages
            messages = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        self._prepare_image(image_url)
                    ]
                }
            ]

            # Call OpenAI API
            logger.info(f"Calling OpenAI {self.model} API")
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=2000,
                temperature=0.3
            )

            # Extract response text
            response_text = response.choices[0].message.content
            
            # Normalize response
            normalized = self._normalize_response(response_text)
            
            runtime = time.time() - start_time
            logger.info(f"OpenAI API call completed in {runtime:.2f}s")
            
            return normalized

        except Exception as e:
            logger.error(f"Error in OpenAI API call: {str(e)}", exc_info=True)
            runtime = time.time() - start_time
            return {
                "image_understanding": None,
                "detected_defects": None,
                "root_cause": None,
                "severity": None,
                "recommendations": None,
                "confidence": None,
                "error": f"OpenAI API error: {str(e)}"
            }

    def analyze_gpt4_1(self, image_url: str, description: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyze an image using OpenAI GPT-4.1.
        
        Args:
            image_url: URL or base64 data URL of the image
            description: Optional description text
            
        Returns:
            Normalized response dictionary
        """
        start_time = time.time()
        
        try:
            # Prepare the prompt
            prompt = """You are a highly accurate defect detection expert.

Analyze the provided image and user description.

Your tasks:
1. Identify object/environment in the image.
2. Detect any visible defects, damages, irregularities.
3. Explain likely root cause.
4. Provide severity level: low, medium, or high.
5. Give precise recommendations for what to do next.
6. Give a confidence score between 0 to 1.

Return output in this JSON format only:

{
  "image_understanding": "",
  "detected_defects": "",
  "root_cause": "",
  "severity": "",
  "recommendations": "",
  "confidence": ""
}"""

            if description:
                prompt += f"\n\nUser Description: {description}"

            # Prepare messages
            messages = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        self._prepare_image(image_url)
                    ]
                }
            ]

            # Call OpenAI API with GPT-4.1
            logger.info(f"Calling OpenAI {self.gpt4_1_model} API")
            response = self.client.chat.completions.create(
                model=self.gpt4_1_model,
                messages=messages,
                max_tokens=2000,
                temperature=0.3
            )

            # Extract response text
            response_text = response.choices[0].message.content
            
            # Normalize response
            normalized = self._normalize_response(response_text)
            
            runtime = time.time() - start_time
            logger.info(f"OpenAI GPT-4.1 API call completed in {runtime:.2f}s")
            
            return normalized

        except Exception as e:
            logger.error(f"Error in OpenAI GPT-4.1 API call: {str(e)}", exc_info=True)
            runtime = time.time() - start_time
            return {
                "image_understanding": None,
                "detected_defects": None,
                "root_cause": None,
                "severity": None,
                "recommendations": None,
                "confidence": None,
                "error": f"OpenAI GPT-4.1 API error: {str(e)}"
            }

