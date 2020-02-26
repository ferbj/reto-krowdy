
import fs from 'fs'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

function moldear() {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);

    let command = ffmpeg()

    let x = 960, y = 720;

    let videoInfo = [];
    
    let savepath = '../ruta/';

    const folderpath = path.join(__dirname, savepath);
    
    fs.readdir(folderpath, (err, files,s3) => {
        
        if (!files || files.length === 0) {

            return;
        }
        files.forEach(function (file, id) {

            const filePath = path.join(folderpath, file);

            if (fs.lstatSync(filePath).isDirectory()) {
                next;
            }
            fs.readFile(filePath, (error, fileContent) => {
                // if unable to read file contents, throw exception
                if (error) { throw error; }
                let filename = file;
                console.log(id + ': Input File ... ' + filename);
                videoInfo.push({
                    filename: filePath
                });
                // console.log(videoInfo)
                command = command.addInput(filePath);
                // console.log(videoInfo)
            });
            // console.log(id)
            cords(x, y, id, files);
        });
        process(x, y,videoInfo);
    });
    

    function cords(x, y, id, files) {
        switch (id) {
            case 0:
                videoInfo[0] = { coord: { x: 0, y: y / 6 } }
                break;
            case 1:
                videoInfo[1] = { coord: { x: x / 3, y: y / 6 } }
                break;
            case 2:
                videoInfo[2] = { coord: { x: x / 1.5, y: y / 6 } }
                break;
            case 3:
                videoInfo[3] = { coord: { x: 0, y: y / 2 } }
                break;
            case 4:
                videoInfo[4] = { coord: { x: x / 3, y: y / 2 } }
                break;
            case 5:
                videoInfo[5] = { coord: { x: x / 1.5, y: y / 2 } }
                break;

        }
        return videoInfo;
    }

    function process(x, y,videoInfo) {
        
        console.log('videoInfo', videoInfo)
        var complexFilter = [];
        complexFilter.push('nullsrc=size=' + x + 'x' + y + ' [base0]');

        // Scale each video
        videoInfo.forEach(function (val, index, array) {
            complexFilter.push({
                filter: 'setpts=PTS-STARTPTS, scale', options: [x / 3, y / 3],
                inputs: index + ':v', outputs: 'block' + index
            });

        });

        // Build Mosaic, block by block
        videoInfo.forEach(function (val, index, array) {
            complexFilter.push({
                filter: 'overlay', options: { x: val.coord.x, y: val.coord.y },
                inputs: ['base' + index, 'block' + index], outputs: 'base' + (index + 1)
            });
        });
        console.log('complexFilter', complexFilter)
        let file1 = 'mosaico1.mp4';
        let file2 = 'mosaico2.webm';
        //duration of video and building of mosaic video
        // no usar dirname envia al directorio de moldear console.log('dirname',__dirname)
        command
            .duration(20)
            .videoCodec('libx264')
            .audioCodec('libmp3lame')
            .format('mp4')
            .complexFilter(complexFilter, 'base6')
            .save('./files/mosaico/' + file1)
            .on('error', function (err) {
                console.log('An error occurred: ' + err.message);
            })
            .on('progress', function (progress) {
                console.log('... frames: ' + progress.frames);
            })
            .on('end', function () {
                console.log('Finished processing');
            });
        //waiting 20 seconds of first processing from mp4 to webm
        setTimeout(() => {
            ffmpeg({ source: './files/mosaico/' + file1 })
                .withVideoCodec('libvpx')
                .addOptions(['-qmin 0', '-qmax 50', '-crf 5'])
                .withVideoBitrate(1024)
                .withAudioCodec('libvorbis')
                .saveToFile('./files/mosaico/' + file2);

        }, 45000);
     
    }
      
    
}
export default moldear;
