<?php

# Includes the autoloader for libraries installed with composer
require __DIR__ . '/vendor/autoload.php';

use Google\Cloud\Speech\V1\SpeechClient;
use Google\Cloud\Speech\V1\RecognitionAudio;
use Google\Cloud\Speech\V1\RecognitionConfig;
use Google\Cloud\Speech\V1\RecognitionConfig\AudioEncoding;

/**
 * Transcribe an audio file using Google Cloud Speech API
 * Example:
 * ```
 * transcribe_sync('/path/to/audiofile.wav');
 * ```.
 *
 * @param string $audioFile path to an audio file.
 *
 * @return string the text transcription
 */
function transcribe_sync($audioFile)
{
    // change these variables
    $encoding = AudioEncoding::LINEAR16;
    $sampleRateHertz = 16000;
    $languageCode = 'en-US';

    // get contents of a file into a string
    $content = file_get_contents($audioFile);

    // set string as audio content
    $audio = (new RecognitionAudio())
        ->setContent($content);

    // set config
    $config = (new RecognitionConfig())
        ->setEncoding($encoding)
        ->setSampleRateHertz($sampleRateHertz)
        ->setLanguageCode($languageCode);
    
    putenv('GOOGLE_APPLICATION_CREDENTIALS=credentials.json');

    // create the speech client
    $client = new SpeechClient();

    try {
        $response = $client->recognize($config, $audio);
        foreach ($response->getResults() as $result) {
            $alternatives = $result->getAlternatives();
            $mostLikely = $alternatives[0];
            $transcript = $mostLikely->getTranscript();
            $confidence = $mostLikely->getConfidence();
            printf('%s' . PHP_EOL, $transcript);
//            printf('Confidence: %s' . PHP_EOL, $confidence);
        }
    } finally {
        $client->close();
    }
}

if (isset($_FILES['file']) and !$_FILES['file']['error']) {    
    $data = $_FILES['file']['tmp_name'];
    $fileName = time();
    $filePath = "sounds/" . $fileName . ".wav";
    move_uploaded_file($data, $filePath);
    
    $speech = transcribe_sync($filePath);
    echo $speech;
    
    unlink($filePath);
}

?>