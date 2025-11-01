// প্রয়োজনীয় HTML এলিমেন্টগুলোকে জাভাস্ক্রিপ্টে ধরা হচ্ছে
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoContainer = document.getElementById('videoContainer');
const recordedVideo = document.getElementById('recordedVideo');
const downloadLink = document.getElementById('downloadLink');

let mediaRecorder;
let mediaStream;
let recordedChunks = [];

// রেকর্ডিং শুরু করার বাটনে ইভেন্ট লিসেনার যোগ করা হচ্ছে
startBtn.addEventListener('click', async () => {
    recordedChunks = []; // আগের রেকর্ডিংয়ের ডাটা পরিষ্কার করা হচ্ছে

    try {
        // ব্রাউজারের স্ক্রিন ক্যাপচার API ব্যবহার করে স্ক্রিন শেয়ার করার অনুমতি চাওয়া হচ্ছে
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true // অডিওও রেকর্ড করার জন্য
        });

        // MediaRecorder অবজেক্ট তৈরি করা হচ্ছে যা স্ট্রিমকে রেকর্ড করবে
        mediaRecorder = new MediaRecorder(mediaStream, {
            mimeType: 'video/webm' // আউটপুট ভিডিওর ফরম্যাট
        });

        // যখন রেকর্ডার ডাটা পাবে, তখন এই ইভেন্টটি কাজ করবে
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        // যখন রেকর্ডিং বন্ধ হবে, তখন এই ইভেন্টটি কাজ করবে
        mediaRecorder.onstop = () => {
            // রেকর্ড করা সব ডাটা একসাথে করে একটা Blob অবজেক্ট বানানো হচ্ছে
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            
            // Blob থেকে একটা URL তৈরি করা হচ্ছে যা ভিডিও প্লে করতে ব্যবহার করা যাবে
            const videoUrl = URL.createObjectURL(blob);

            // ভিডিও প্লেয়ারে এবং ডাউনলোড লিঙ্কে এই URL সেট করা হচ্ছে
            recordedVideo.src = videoUrl;
            downloadLink.href = videoUrl;

            // ভিডিও কন্টেইনারটিকে দৃশ্যমান করা হচ্ছে
            videoContainer.style.display = 'block';
        };

        // রেকর্ডিং শুরু করা হচ্ছে
        mediaRecorder.start();

        // বাটনগুলোর অবস্থা পরিবর্তন করা হচ্ছে
        startBtn.disabled = true;
        stopBtn.disabled = false;

    } catch (error) {
        console.error("রেকর্ডিং শুরু করতে সমস্যা হয়েছে:", error);
        alert("রেকর্ডিং শুরু করতে অনুমতি দেননি বা কোনো সমস্যা হয়েছে।");
    }
});

// রেকর্ডিং বন্ধ করার বাটনে ইভেন্ট লিসেনার যোগ করা হচ্ছে
stopBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop(); // রেকর্ডিং বন্ধ করা হচ্ছে
    }

    // স্ক্রিন শেয়ারিং বন্ধ করা হচ্ছে (ব্রাউজারের শেয়ারিং কন্ট্রোল বন্ধ হয়ে যাবে)
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
    }

    // বাটনগুলোর অবস্থা আবার পূর্বের মতো করা হচ্ছে
    startBtn.disabled = false;
    stopBtn.disabled = true;
});
