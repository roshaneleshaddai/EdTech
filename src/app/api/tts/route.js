import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";

export async function GET(req) {
  // WARNING: Do not expose your keys
  // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of Azure resources

  // Check if Azure Speech credentials are configured
  if (!process.env["SPEECH_KEY"] || !process.env["SPEECH_REGION"]) {
    return Response.json(
      { error: "Azure Speech service credentials not configured" },
      { status: 500 }
    );
  }

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env["SPEECH_KEY"],
    process.env["SPEECH_REGION"]
  );

  // Set output format to MP3
  speechConfig.speechSynthesisOutputFormat =
    sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

  // https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts
  const teacher = req.nextUrl.searchParams.get("teacher") || "Jenny";

  // Force set the English voice - ensure it's not using Japanese voices
  const englishVoice = `en-US-${teacher}Neural`;
  speechConfig.speechSynthesisVoiceName = englishVoice;

  // Additional validation to ensure we're using English voices
  if (!englishVoice.includes("en-US-")) {
    console.error(
      "Invalid voice configuration - not using English voice:",
      englishVoice
    );
    return Response.json(
      { error: "Invalid voice configuration" },
      { status: 400 }
    );
  }

  // Add some debugging
  console.log("Speech config:", {
    region: process.env["SPEECH_REGION"],
    voice: speechConfig.speechSynthesisVoiceName,
    outputFormat: speechConfig.speechSynthesisOutputFormat,
  });

  const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
  const visemes = [];
  speechSynthesizer.visemeReceived = function (s, e) {
    // console.log(
    //   "(Viseme), Audio offset: " +
    //     e.audioOffset / 10000 +
    //     "ms. Viseme ID: " +
    //     e.visemeId
    // );
    visemes.push([e.audioOffset / 10000, e.visemeId]);
  };
  const audioStream = await new Promise((resolve, reject) => {
    speechSynthesizer.speakTextAsync(
      req.nextUrl.searchParams.get("text") ||
        "I'm excited to try text to speech",
      (result) => {
        speechSynthesizer.close();

        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const { audioData } = result;

          if (audioData) {
            // convert arrayBuffer to stream
            const bufferStream = new PassThrough();
            bufferStream.end(Buffer.from(audioData));
            resolve(bufferStream);
          } else {
            reject(new Error("No audio data received"));
          }
        } else {
          const errorMessage = `Speech synthesis failed. Reason: ${result.reason}`;
          console.error("Speech synthesis failed:", {
            reason: result.reason,
            errorDetails: result.errorDetails,
            properties: result.properties,
          });
          reject(new Error(errorMessage));
        }
      },
      (error) => {
        console.log("Speech synthesis error:", error);
        speechSynthesizer.close();
        reject(error);
      }
    );
  });
  try {
    const response = new Response(audioStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `inline; filename=tts.mp3`,
        Visemes: JSON.stringify(visemes),
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating response:", error);
    return Response.json(
      { error: "Failed to create audio response" },
      { status: 500 }
    );
  }
}
