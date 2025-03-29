# bugsbyte2025

Setup to launch the server of the backend in linux ubunto:

$sudo apt install python3 python3-venv python3-pip -y

$pip install fastapi uvicorn sqlmodel

$pip install -r requirements.txt


Run the server:
$uvicorn main:app --host 0.0.0.0 --port 8000 --reload

Know the link of the api (http://"host":8000):
$hostname -I
