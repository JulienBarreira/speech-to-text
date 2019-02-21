(function($) {
    'use strict';

    $.Theme = function() {
        var self = this;

        // Common Elements
        self.elements = {
            body: $('body'),
            speechBtn: $('#speechBtn'),
            volume: $('#volume'),
            input: $('#input'),
            formMessage: $('#form-message'),
            speechActive: false
        };
    };

    $.Theme.prototype = {
        /**
         * Initialisation
         */
        load: function() {
            var self = this;
            
            this.initSpeechEvents();
        },
        
        /**
         * Speech Handler
         */
        initSpeechEvents: function() {
            var self = this;
            
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            this.elements.audioContext = new AudioContext;
            
            this.elements.speechBtn.on('click', function(event) {
                event.preventDefault();
                
                if (self.elements.speechBtn.hasClass('is-recording')) {
                    self.stopRecording();
                } else {
                    if (!self.elements.speechActive) {                        
                        self.elements.audioContext.resume().then(() => {
                            self.startRecording();
                        });
                    }
                }
            });
        },
        
        /**
         * Recording
         */
        startRecording: function() {
            var self = this;
            this.elements.speechActive = true;
            this.elements.formMessage.removeClass('is-visible');
            console.log("Button clicked");

            var constraints = {audio: true, video: false}

            navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
                self.elements.gumStream = stream;
                var input = self.elements.audioContext.createMediaStreamSource(stream);
                self.elements.rec = new Recorder(input,{numChannels:1})

                self.elements.speechEvents = hark(stream);

                self.elements.speechEvents.on('speaking', function() {
                    console.log('Speaking!');
                });

                self.elements.speechEvents.on('stopped_speaking', function() {
                    console.log('Stopped speaking');
                    if (self.elements.speechBtn.hasClass('is-recording')) {
                        self.stopRecording();
                    }
                });

                self.elements.speechEvents.on('volume_change', function(volume) {
                    self.volumeHandler(volume);
                });

                self.elements.rec.record()

                console.log("Recording started");
                self.elements.speechBtn.addClass('is-recording');
            }).catch(function(err) {});
        },
        
        /**
         * Stop Recording
         */
        stopRecording: function() {
            this.elements.speechBtn.removeClass('is-recording');
            
            this.elements.rec.stop();
            console.log("Recording stopped");
            this.elements.speechEvents.stop();            
            
            //stop microphone access
            this.elements.gumStream.getAudioTracks()[0].stop();

            this.elements.rec.exportWAV(this.sendSpeechData.bind(this));
        },
        
        /**
         * Volume events handler
         */
        volumeHandler: function(volume) {
            // this line could be improved
            var volumeNumber = Math.round((volume + 100) * 2 - 100);
            
            if (volumeNumber < 0) {
                volumeNumber = 0;
            } else if (volumeNumber < 10) {
                volumeNumber = "0" + volumeNumber;
            }
            var volumeData = volumeNumber.toString();
            this.elements.volume.css("transform", "translate(-50%, -50%) scale(1." + volumeData + ")");
        },
        
        /**
         * Send speech data
         */
        sendSpeechData: function(blob) {
            var self = this;
            
            this.elements.speechBtn.addClass('is-loading');
            
            console.log('Sending data to Google')
            
            var data = new FormData();
            data.append('file', blob);

            $.ajax({
                url :  "speech.php",
                type: 'POST',
                data: data,
                contentType: false,
                processData: false,
                success: function(data) {
                    console.log('Data received');
                    console.log(data);
                    
                    self.elements.speechBtn.removeClass('is-loading');
                    
                    var dataFirstLetter = data.charAt(0);
                    if (dataFirstLetter === '' || dataFirstLetter === '<') {
                        self.showErrorMessage(dataFirstLetter);
                    } else {                        
                        self.appendForm(data);
                    }
                    
                    self.elements.speechActive = false;
                },    
                error: function(data) {
                    console.log('Error');
                    console.log(data);
                    
                    self.elements.speechBtn.removeClass('is-loading');
                    
                    self.showErrorMessage('<');
                    
                    self.elements.speechActive = false;
                }
            });
        },
        
        /**
         * Append data to form
         */
        appendForm: function(data) {
            this.elements.input.val(data);
        },
        
        /**
         * Show error message when there's a problem with the answer
         */
        showErrorMessage: function(character) {
            if (character === '') {
                var message = 'We could\'t understand your message, please try again.';                    
            } else if (character === '<') {
                var message = 'An error has occurred, please try again.';
            }
            
            this.elements.formMessage.text(message);
            this.elements.formMessage.addClass('is-visible');
        }
    };
    
    /**
     * OnReady
     */
    $(document).ready(function() {
        var theme = new $.Theme();

        // All
        theme.load();
    });
})(jQuery);
