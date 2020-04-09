'use strict';

class SoundPlayer {

    audioElement = new Audio();

    /**
     * 
     * @param {str} url 
     */
    constructor(url) {
        this.audioElement.src = url;

        /* 音声データのメタデータロード完了時に起動 */
        this.audioElement.addEventListener("loadedmetadata", () => {
            this.init(); // 初期化
        });
    }

    /**
     * 初期化
     */
    init() {

        this.PlaySoundInitializer();
        this.SeekbarInitializer();
        this.TimeDisplayInitializer();
        this.SoundInitializer();
    }

    PlaySoundInitializer() {
        document.getElementById("videoPlay").onpointerdown = () => {
            soundObject.ClickPlayButton();
        }
    }

    SeekbarInitializer() {
        const seekbar = document.getElementById("videoSeekbar");
        seekbar.max = this.audioElement.duration;

        seekbar.oninput = () => {
            const seekbarValue = document.getElementById("videoSeekbar").value;
            this.audioElement.currentTime = seekbarValue;
            document.getElementById("currentTimeDisplayer").innerHTML = Timecode2HMS(Math.floor(seekbarValue)).slice(3);
        };
    }

    TimeDisplayInitializer() {
        
        /* スマホだと表示が難しくなるため動画長は決め打ちにして動画の長さ表示を削除 */
        // const endTimeDisplayer = document.getElementById("endTimeDisplayer");
        // const videoDuration = this.audioElement.duration;
        // endTimeDisplayer.innerHTML = Timecode2HMS(Math.floor(videoDuration)).slice(3);

        const currentTimeDisplayer = document.getElementById("currentTimeDisplayer");
        currentTimeDisplayer.innerHTML = Timecode2HMS(0).slice(3);

        this.audioElement.ontimeupdate = () => {
            const currentTime = this.audioElement.currentTime;
            const videoTimeHMS = Timecode2HMS(Math.floor(currentTime)).slice(3);
            const currentTimeDisplayer = document.getElementById("currentTimeDisplayer");

            document.getElementById("videoSeekbar").value = currentTime; // CreateSeekbarで循環しそう
            currentTimeDisplayer.innerHTML = videoTimeHMS;
            currentTimeDisplayer.value = currentTime;
            // if (document.hasFocus())
            //     document.title = "VideoNote";
            // else // 非フォーカス時はタイトルを動画情報に変更
            //     document.title = _videoObjectList[_nowVideoIndex].name.slice(0, 4) + "[" + videoTimeHMS + "]";
        };
    }
    SoundInitializer() {
        const soundbar = document.getElementById("soundController");
        soundbar.oninput = () => {
            this.audioElement.volume = document.getElementById("soundController").value;
        };
    }

    PlaySound() {
        this.audioElement.play();
    }
    StopSound() {
        this.audioElement.pause();
    }
    ClickPlayButton() {
        const icon = document.getElementById("videoPlayIcon");
        if (this.audioElement.paused) {
            this.audioElement.play();
            if (icon.classList.contains("fa-play"))
                icon.classList.remove("fa-play");
            icon.classList.add("fa-pause");
        } else {
            this.audioElement.pause();
            if (icon.classList.contains("fa-pause"))
                icon.classList.remove("fa-pause");
            icon.classList.add("fa-play");
        }
    }
    ChangeSoundVolume() {
        this.audioElement.volume = document.getElementById("sound-controller").value;
    }
}

/**
 * 秒を時分秒に修正
 * @param {String} 時分秒の文字列 
 */
function Timecode2HMS(timeCode) {
    let hms = "";
    const h = timeCode / 3600 | 0;
    const m = timeCode % 3600 / 60 | 0;
    const s = parseInt(timeCode) % 60;

    if (h != 0)
        hms = ZeroPadding(h) + "：" + ZeroPadding(m) + "：" + ZeroPadding(s);
    else if (m != 0)
        hms = "00：" + ZeroPadding(m) + "：" + ZeroPadding(s);
    else
        hms = "00：00：" + ZeroPadding(s);
    return hms;
}
/**
* 映像時間の0埋め
* @param {String} timeCode 
*/
function ZeroPadding(timeCode) {
    if (timeCode < 10) return "0" + timeCode;
    else return timeCode;
}