# import torch
# from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
# import torchaudio

# # Load model and processor
# processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
# model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")

# # Load audio file (can be WAV or other formats supported by torchaudio)
# waveform, sample_rate = torchaudio.load("/Users/akhilaasonduri/Downloads/16000Hz_OnlineSound.net.wav")
# print(f"Original Sample rate: {sample_rate}, waveform shape: {waveform.shape}")

# # Convert stereo to mono if necessary
# if waveform.shape[0] > 1:
#     waveform = waveform.mean(dim=0, keepdim=True)
#     print("Converted to mono")

# # Resample if necessary
# if sample_rate != 16000:
#     resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
#     waveform = resampler(waveform)
#     sample_rate = 16000
#     print(f"Resampled to {sample_rate}")

# # Convert waveform tensor to 1D numpy array for processor
# audio_input = waveform.squeeze().numpy()

# # Tokenize input
# input_values = processor(audio_input, sampling_rate=sample_rate, return_tensors="pt").input_values

# # Predict
# with torch.no_grad():
#     logits = model(input_values).logits

# predicted_ids = torch.argmax(logits, dim=-1)
# transcription = processor.decode(predicted_ids[0])

# print("Transcription:", transcription)

import torch
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
import torchaudio

# Load model and processor
processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")

# Load audio file (replace path with your file)
waveform, sample_rate = torchaudio.load("/Users/akhilaasonduri/Downloads/16000Hz_OnlineSound.net.wav")
print(f"Original Sample rate: {sample_rate}, waveform shape: {waveform.shape}")

# Convert stereo to mono if necessary
if waveform.shape[0] > 1:
    waveform = waveform.mean(dim=0, keepdim=True)
    print("Converted to mono")

# Resample if necessary
if sample_rate != 16000:
    resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
    waveform = resampler(waveform)
    sample_rate = 16000
    print(f"Resampled to {sample_rate}")

# Debug: print first few waveform samples
print("Waveform samples:", waveform[0, :20])

# Convert waveform tensor to 1D numpy array for processor
audio_input = waveform.squeeze().numpy()

# Tokenize input
input_values = processor(audio_input, sampling_rate=sample_rate, return_tensors="pt").input_values

# Predict logits
with torch.no_grad():
    logits = model(input_values).logits

print("Logits shape:", logits.shape)

# Get predicted IDs
predicted_ids = torch.argmax(logits, dim=-1)
print("Predicted IDs:", predicted_ids)

# Decode transcription
transcription = processor.decode(predicted_ids[0])
print("Transcription:", transcription)
