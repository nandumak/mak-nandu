import streamlit as st
import ollama


DEFAULT_MODEL = "llama3.2"


def get_local_models():
    """Return locally installed Ollama model names."""
    try:
        response = ollama.list()
        models = response.get("models", [])
        names = []

        for model in models:
            name = model.get("name") or model.get("model")
            if name:
                names.append(name)

        return names
    except Exception:
        return []


def stream_llm_response(messages, model):
    """Stream an Ollama chat response chunk by chunk."""
    try:
        stream = ollama.chat(
            model=model,
            messages=messages,
            stream=True,
        )

        for chunk in stream:
            content = chunk.get("message", {}).get("content", "")
            if content:
                yield content

    except ollama.ResponseError as error:
        yield (
            f"Ollama returned an error: {error}\n\n"
            f"Make sure the model is installed with: `ollama pull {model}`"
        )
    except ollama.RequestError as error:
        yield (
            f"Could not connect to Ollama: {error}\n\n"
            "Make sure Ollama is running on your computer."
        )
    except Exception as error:
        yield f"Unexpected error: {error}"


st.set_page_config(
    page_title="Local Ollama Chatbot",
    page_icon="AI",
    layout="centered",
)

st.title("Local Ollama Chatbot")
st.caption("Chat with a local model using Streamlit and Ollama.")

available_models = get_local_models()
model_options = available_models or [DEFAULT_MODEL, "mistral", "gemma:2b"]

with st.sidebar:
    st.header("Settings")
    selected_model = st.selectbox("Ollama model", model_options)
    st.caption("Install a model with `ollama pull llama3.2`.")

    if st.button("Clear chat"):
        st.session_state.messages = []
        st.rerun()

if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

prompt = st.chat_input("Ask something...")

if prompt:
    st.session_state.messages.append({"role": "user", "content": prompt})

    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        response_box = st.empty()
        full_response = ""

        for token in stream_llm_response(st.session_state.messages, selected_model):
            full_response += token
            response_box.markdown(full_response)

    st.session_state.messages.append(
        {"role": "assistant", "content": full_response}
    )
