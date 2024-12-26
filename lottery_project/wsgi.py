import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "lottery_project.settings") 
import sys
from pathlib import Path
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
from dotenv import load_dotenv  #For loading .env file.

load_dotenv() # Call this function here

# Add the project and virtual environment paths
BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent


sys.path.append(str(PROJECT_ROOT))  # Add the parent directory
sys.path.append(str(PROJECT_ROOT / "lottery_project"))
sys.path.append(str(PROJECT_ROOT / "lottery_project/.venv/lib/python3.10/site-packages"))  # Add virtual env path. This line depends on where PythonAnywhere puts your virtual environment files.


 #PythonAnywhere might use some other settings, but this should also be fine