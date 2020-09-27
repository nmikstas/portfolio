%Initial variables.
clear;
pkg load signal;
fig = 1;
filter_cutoff_hz = 5000;
int_freq = filter_cutoff_hz;

%This part may be commented out after the original filtered audio is created
%because the process of filtering is very time consuming and takes a long time
%to process.
%%%%%%%%%%%%%%%%%%%%%%%%%%%% Filter Original Input %%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%get the Original input sample and convert to mono.
[original,fs]=audioread('./audio/original.wav');
orig_mono = original';
orig_mono = orig_mono(1,:);

%Perform FFT of mono input.
orig_fft = fft(orig_mono,length(orig_mono));

%Calculate x-axis frequency values.
fft_len = length(orig_fft);
dw = fs/fft_len;
x_axis = (-fs/2 : dw : fs/2-dw);

%Low pass filter the signal by zeroing out samples after cutoff.
orig_filt_fft = fftshift(orig_fft);
for m = 1:length(x_axis);
    if abs(x_axis(m)) > filter_cutoff_hz
      orig_filt_fft(m) = 0;
    end
end

%Display original mono input.
figure(fig);
fig = fig + 1;
semilogx(x_axis, abs(fftshift(orig_fft)));
xlim([20 filter_cutoff_hz*3]);
title('Original input audio FFT');
ylabel('Amplitude');
xlabel('frequency(Hz)');
grid on;

%Display filtered mono input.
figure(fig);
fig = fig + 1;
semilogx(x_axis, abs(orig_filt_fft));
xlim([20 filter_cutoff_hz*3]);
title('Original input audio FFT - Lowpass Filtered at 5KHz');
ylabel('Amplitude');
xlabel('frequency(Hz)');
grid on;

%Convert back to time domain and play resulting audio.
orig_filt = ifft(fftshift(orig_filt_fft));
sound(orig_mono, fs);
sound(orig_filt, fs);

%Save processed audio to wave file.
audiowrite('./audio/orig_filt.wav', orig_filt, fs);

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


%%%%%%%%%%%%%%%%%%%%%%%% Frequency Shift Filtered Input %%%%%%%%%%%%%%%%%%%%%%%%

%get the filtered input sample.
[orig_filt,fs]=audioread('./audio/orig_filt.wav');

%Perform FFT of filtered input.
orig_filt_fft = fft(orig_filt,length(orig_filt));

%Cut the array in half to shift frequencies.
half = ceil(length(orig_filt_fft)/2);
first_half = orig_filt_fft(1:half);
second_half = orig_filt_fft(half+1:end);

%calculate the amount to shift. Shift to point right after cutoff.
fft_len = length(orig_filt_fft);
dw = fs/fft_len;
shift_amount = filter_cutoff_hz/dw;
first_half = circshift(first_half, floor(shift_amount));
second_half = circshift(second_half, -floor(shift_amount));
orig_shift_fft = [first_half; second_half];

%Plot the results of the manipulation.
figure(fig);
fig = fig + 1;
x_axis = (-fs/2 : dw : fs/2-dw);
semilogx(x_axis, abs(fftshift(orig_shift_fft)));
xlim([20 filter_cutoff_hz*3]);
title('Audio Signal Content Between 5KHz and 10KHz');
ylabel('Amplitude');
xlabel('frequency(Hz)');
grid on;

%Convert back to time domain and play resulting audio.
orig_shift = ifft(orig_shift_fft, length(orig_shift_fft));
sound(orig_shift, fs);

%Save processed audio to wave file.
audiowrite('./audio/orig_shift.wav', orig_shift, fs);

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


%%%%%%%%%%%%%%%%%%%%%%%%%%%% Heterodyne to Baseband %%%%%%%%%%%%%%%%%%%%%%%%%%%%

%get the frequency shifted input sample.
[orig_shift,fs]=audioread('./audio/orig_shift.wav');

%Perform FFT of frequency shifted input.
orig_shift_fft = fft(orig_shift,length(orig_shift));

%Calculate x-axis frequency values.
fft_len = length(orig_shift_fft);
dw = fs/fft_len;
x_axis = (-fs/2 : dw : fs/2-dw);

%Create a sample array for the intermediate frequency.
t = [0 : 1/fs : length(orig_shift)/fs-1/fs];
mix_freq = cos(2*pi*int_freq*t)';

%Heterodyne the signal with the intermediate frequency!
mixed = mix_freq.*orig_shift;

%Create a low-pass filter with a cutoff of 5KHz.
fstp = 5500; %Stopband edge frequency
N = 101;     %Filter order
designFrqs = [0, filter_cutoff_hz, fstp, fs/2]/fs; %Design frequencies.
amplitudeResponse = [1, 1, 0, 0];%Desired amplitude response.
B = remez(N-1, 2*designFrqs, amplitudeResponse);

%Get the spectrum of the mixed, unfiltered output.
output_mixed_fft = fft(mixed,length(mixed));

%Get the frequency response of the low-pass filter.
[H W] = freqz(B, 1, length(mixed), 'whole');
h_plot = abs(fftshift(H)/max(H)*max(output_mixed_fft));

%plot the mixed, unfiltered output with low-pass filter overlay.
figure(fig);
fig = fig + 1;
semilogx(x_axis, abs(fftshift(output_mixed_fft)), x_axis, h_plot);
xlim([20 filter_cutoff_hz*3]);
title('Heterodyned, Unfiltered Audio Spectrum With Low-pass Filter Overlay');
ylabel('Amplitude');
xlabel('frequency(Hz)');
legend('Audio Spectrum', 'Low-pass Filter', 'Location', 'SouthOutside');
grid on;

%Filter the heterodyned audio signal.
output_filtered = filter(B, 1, mixed);

%Get the spectrum of the final output.
output_filtered_fft = fft(output_filtered,length(output_filtered));

%Plot the frequency spectrum of the final output.
figure(fig);
fig = fig + 1;
semilogx(x_axis, abs(fftshift(output_filtered_fft)));
xlim([20 filter_cutoff_hz*3]);
title('Heterodyned, Filtered Audio Spectrum');
ylabel('Amplitude');
xlabel('frequency(Hz)');
grid on;

%Play the processed audio samples.
sound(mixed, fs);
sound(output_filtered, fs);

%Save processed audio to wave files.
audiowrite('./audio/output_unfiltered.wav', mixed, fs);
audiowrite('./audio/output.wav', output_filtered, fs);

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
