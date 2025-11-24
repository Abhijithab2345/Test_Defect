# Defect Detection API - Backend

FastAPI backend for multi-model defect detection analysis.

## Features

- **GPT-4o Integration**: Analyze images using OpenAI's GPT-4o vision model
- **Standardized Response Format**: Normalized JSON responses
- **Analysis History**: In-memory storage of past analyses
- **Error Handling**: Graceful error handling for API failures
- **CORS Support**: Configured for frontend integration

## Tech Stack

- **Framework**: FastAPI
- **AI Model**: OpenAI GPT-4o
- **Language**: Python 3.8+
- **Server**: Uvicorn

## Setup

### Prerequisites

- Python 3.8 or higher
- OpenAI API key

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the `backend` directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Running the Server

Development mode:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /api/analyze

Analyze an image for defects.

**Request:**
```json
{
  "image_url": "data:image/jpeg;base64,...",
  "description": "Optional description"
}
```

**Response:**
```json
{
  "openai": {
    "image_understanding": "...",
    "detected_defects": "...",
    "root_cause": "...",
    "severity": "medium",
    "recommendations": "...",
    "confidence": "0.85"
  },
  "gemini": null,
  "qwen": null,
  "llama": null,
  "runtime": {
    "openai": 2.5
  }
}
```

### GET /api/history

Get analysis history.

**Response:**
```json
[
  {
    "id": "uuid",
    "timestamp": "2024-01-01T00:00:00",
    "description": "...",
    "results": {...}
  }
]
```

### GET /health

Health check endpoint.

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── app/
│   ├── __init__.py
│   ├── config.py          # Configuration settings
│   ├── models/
│   │   └── schemas.py     # Pydantic models
│   ├── routers/
│   │   ├── analyze.py     # Analyze endpoint
│   │   └── history.py     # History endpoint
│   ├── adapters/
│   │   └── openai_adapter.py  # OpenAI GPT-4o adapter
│   └── storage.py         # Storage layer (in-memory)
├── requirements.txt       # Python dependencies
└── README.md
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `CORS_ORIGINS`: Comma-separated list of allowed CORS origins

## Notes

- Currently only GPT-4o is implemented
- History is stored in-memory and will be lost on server restart
- For production, replace in-memory storage with a database
- Image URLs can be base64 data URLs or regular HTTP/HTTPS URLs

## Development

To add more models in the future:
1. Create a new adapter in `app/adapters/`
2. Initialize it in `app/routers/analyze.py`
3. Add it to the parallel processing logic

