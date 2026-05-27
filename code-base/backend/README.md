# AI Knowledge System - Backend

FastAPI backend service for the AI Knowledge Learning System.

## Tech Stack

- **FastAPI** - High-performance async API framework
- **PyTorch** - Deep learning framework
- **NumPy/Pandas** - Data processing
- **Matplotlib** - Visualization generation
- **Scikit-learn** - Machine learning utilities

## Getting Started

### Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate     # On Windows
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will start at `http://localhost:8000`

### API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
app/
├── api/               # API route handlers
│   ├── knowledge.py   # Knowledge endpoints
│   ├── experiments.py # Training endpoints
│   └── visualizations.py # Image endpoints
├── services/          # Business logic
│   └── knowledge_service.py
├── models/            # Pydantic schemas
│   └── knowledge.py
├── core/              # Core configuration
└── main.py            # FastAPI app entry point
```

## API Endpoints

### Knowledge
- `GET /api/knowledge/modules` - Get all modules
- `GET /api/knowledge/modules/{id}/topics` - Get topics by module
- `GET /api/knowledge/modules/{module_id}/{topic_id}` - Get topic content

### Experiments
- `POST /api/experiments/train` - Start training
- `GET /api/experiments/status/{id}` - Get training status

### Visualizations
- `GET /api/visualizations/{topic}/{image_name}` - Get visualization image

## Development

Add new endpoints by creating files in `app/api/` and registering them in `app/main.py`.
