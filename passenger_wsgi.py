import sys, os

# Add the current directory to sys.path
sys.path.append(os.getcwd())

# Force UTF-8 encoding for the environment
os.environ["LANG"] = "en_US.UTF-8"
os.environ["LC_ALL"] = "en_US.UTF-8"


try:
    # Try to import the Flask app
    from app import app as application
except Exception as e:
    # If import fails, create a fallback application that shows the error
    import traceback
    error_trace = traceback.format_exc()
    
    def application(environ, start_response):
        start_response('200 OK', [('Content-Type', 'text/plain')])
        error_message = f"Error importing Flask app:\n{e}\n\nTraceback:\n{error_trace}"
        return [error_message.encode()]
