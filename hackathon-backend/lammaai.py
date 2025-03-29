from openai import OpenAI

# Function to send a message and get a response
def send_message_to_model(user_message: str) -> str:
    # Read API key from the text file
    with open('apikey.txt', 'r') as file:
        api_key = file.read().strip()

    # Initialize OpenAI client (make sure to replace with your API setup)
    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1", 
        api_key=api_key
    )

    # Send the message to the model
    completion = client.chat.completions.create(
        model="nvidia/llama-3.1-nemotron-70b-instruct", 
        messages=[{"role": "user", "content": user_message}],
        temperature=0.1,
        top_p=1,
        max_tokens=1024,
        stream=True
    )

    # Collect and return the response from the model
    response = ""
    for chunk in completion:
        if chunk.choices[0].delta.content is not None:
            response += chunk.choices[0].delta.content

    return response.strip()  # Remove any extra whitespace at the ends

# Example usage
user_input = "Hello, how are you?"
response_text = send_message_to_model(user_input)
print("Response from model:", response_text)
