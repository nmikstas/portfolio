%Initial variables.
clear;
pkg load signal;
fig = 1;
f1 = 440;  %Note A, 4th octive (A4).
f2 = 1047; %Note C, 6th octive (C6).
filter_cutoff_hz = 1000;
graph_limit = 1700;
sample_length = 100000;
fs = 44100;
int_freq = filter_cutoff_hz;

%Create a sample array for a 3KHz tone
t = [0 : 1/fs : sample_length/fs-1/fs];
audio1 = cos(2*pi*f1*t);
audio2 = cos(2*pi*f2*t);

%Mix the two tones together.
audio_mix = audio1.*audio2;

%Get the FFT of the three tones.
audio1_fft = fft(audio1,length(audio1));
audio2_fft = fft(audio2,length(audio2));
mixed_fft = fft(audio_mix,length(audio_mix));

%Calculate x-axis frequency values.
fft_len = sample_length;
dw = fs/fft_len;
x_axis = (-fs/2 : dw : fs/2-dw);

%plot the first tone in the time domain.
figure(fig);
fig = fig + 1;
plot(t, audio1);
xlim([0 .01]);
ylim([-1.5 1.5]);
title('Pure Audio Tone A4, Time Domain');
ylabel('Amplitude');
xlabel('Time(Seconds)');
grid on;

%Plot the first tone in the frequency domain.
figure(fig);
fig = fig + 1;
plot(x_axis, abs(fftshift(audio1_fft)));
xlim([0 graph_limit]);
title('Pure Audio Tone A4, Frequency Domain');
ylabel('Amplitude');
xlabel('frequency(Hertz)');
grid on;

%plot the second tone in the time domain.
figure(fig);
fig = fig + 1;
plot(t, audio2);
xlim([0 .01]);
ylim([-1.5 1.5]);
title('Pure Audio Tone C6, Time Domain');
ylabel('Amplitude');
xlabel('Time(Seconds)');
grid on;

%Plot the second tone in the frequency domain.
figure(fig);
fig = fig + 1;
plot(x_axis, abs(fftshift(audio2_fft)));
xlim([0 graph_limit]);
title('Pure Audio Tone C6, Frequency Domain');
ylabel('Amplitude');
xlabel('frequency(Hertz)');
grid on;

%Plot the mixing of the two tones in the time domain.
figure(fig);
fig = fig + 1;
plot(t, audio_mix);
xlim([0 .01]);
ylim([-1.5 1.5]);
title('Notes A4 and C6 Mixed Together, Time Domain');
ylabel('Amplitude');
xlabel('Time(Seconds)');
grid on;

%Plot the mixed tones in the frequency domain.
figure(fig);
fig = fig + 1;
plot(x_axis, abs(fftshift(mixed_fft)));
xlim([0 graph_limit]);
title('Notes A4 and C6 Mixed Together, Frequency Domain');
ylabel('Amplitude');
xlabel('frequency(Hertz)');
grid on;

%A plot of all the generated tones on the same graph.
figure(fig);
fig = fig + 1;
plot(x_axis, abs(fftshift(audio1_fft)),...
     x_axis, abs(fftshift(audio2_fft)),...
     x_axis, abs(fftshift(mixed_fft)));
xlim([0 1700]);
title('Overlay of All Tones');
ylabel('Amplitude');
xlabel('frequency(Hertz)');
legend('A4', 'C6', 'A4 and C6 Mixed', 'Location', 'SouthOutside');
grid on;

%Create a low-pass filter with a cutoff of 5KHz.
fstp = filter_cutoff_hz + 100; %Stopband edge frequency
N = 401; %Filter order
designFrqs = [0, filter_cutoff_hz, fstp, fs/2]/fs; %Design frequencies.
amplitudeResponse = [1, 1, 0, 0];%Desired amplitude response.
B1 = remez(N-1, 2*designFrqs, amplitudeResponse);

%Get the frequency response of the low-pass filter.
[H1 W1] = freqz(B1, 1, sample_length, 'whole');
h_plot1 = abs(fftshift(H1)/max(H1)*max(mixed_fft));

%plot the mixed, unfiltered output with low-pass filter overlay.
figure(fig);
fig = fig + 1;
plot(x_axis, abs(fftshift(mixed_fft)), x_axis, h_plot1);
xlim([0 graph_limit]);
title('Mixed Audio Spectrum With Low-pass Filter Overlay');
ylabel('Amplitude');
xlabel('frequency(Hz)');
legend('Audio Spectrum', 'Low-pass Filter', 'Location', 'SouthOutside');
grid on;

%Filter the mixed audio signal and retain the lower of the two frequencies.
output_filtered = filter(B1, 1, audio_mix);

%Get the spectrum of the final output.
output_filtered_fft = fft(output_filtered, sample_length);

%Plot the frequency spectrum of the final output.
figure(fig);
fig = fig + 1;
plot(x_axis, abs(fftshift(output_filtered_fft)));
xlim([20 graph_limit]);
title('Filtered Audio Spectrum');
ylabel('Amplitude');
xlabel('frequency(Hz)');
grid on;

%Play all the generated sounds.
sound(audio1, fs);
sound(audio2, fs);
sound(audio_mix, fs);
sound(output_filtered, fs);

%Save all the generated sounds to wave files.
audiowrite('./audio/a4.wav', audio1, fs);
audiowrite('./audio/c6.wav', audio2, fs);
audiowrite('./audio/a4c6_mixed.wav', audio_mix, fs);
audiowrite('./audio/a4c6_filtered.wav', output_filtered, fs);

