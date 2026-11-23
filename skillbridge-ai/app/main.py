from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.skill_routes import router as skill_router
from app.api.routes.career_prediction import router as career_router

app = FastAPI(
    title="SkillBridge AI Microservice",
    description="Intelligent Skill Gap Analysis, TF-IDF Job Matching, and Career Prediction Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(skill_router)
app.include_router(career_router)

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "SkillBridge AI Microservice",
        "runtime": "Python 3.12 / FastAPI"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
