import random

def get_random_prompt():
    prompts = [
        "What is one thing you accomplished today that you are proud of?",
        "Describe a challenge you faced today and how you handled it.",
        "Who was someone that made you smile today, and why?",
        "What is a goal you want to focus on tomorrow?",
        "Reflect on a moment today when you felt particularly stressed or calm.",
        "What is something new you learned or realized about yourself today?",
        "If you could change one thing about how today went, what would it be?"
        "How will you break down your tasks to manage your time effectively"
        "What is one thing you can do today to make tomorrow make easier"
        

    ]
    return random.choice(prompts)