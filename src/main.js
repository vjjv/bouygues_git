var PNGReader = require('./PNGReader');
import {
    bootstrapCameraKit,
    createMediaStreamSource,
    Transform2D,
    // Injectable,
    // RemoteApiService,
    // RemoteApiServices,
    // RemoteApiRequest,
    // RemoteApiRequestHandler,
    // RemoteApiStatus,
    // remoteApiServicesFactory,

} from '@snap/camera-kit';
// var PNGReader = require('png.js');



(async function () {


    // const damsService = {
    //     apiSpecId: '87e3aee3-0a82-4fbd-8d71-b4534c79704c',
    //     getRequestHandler(request) {
    //         if (request.endpointId !== 'prize') return;

    //         return async (reply) => {
    //             const res = await fetch(`https://bouygues-404412.lm.r.appspot.com/prize?mail=${request.parameters.mail}`, {
    //                 headers: {
    //                     Accept: 'application/json',
    //                 },
    //             });

    //             const text = await res.text();

    //             reply({
    //                 status: 'success',
    //                 metadata: {},
    //                 body: new TextEncoder().encode(text)
    //             });

    //             const obj = JSON.parse(text);
    //             console.log('CODE : ' + obj.code);
    //             carton(obj.mail, obj.code)
    //         };
    //     }
    // };


    function carton(mail, code) {
        document.getElementById("mail").textContent = mail;
        document.getElementById("code").textContent = code;
        document.getElementById('card-container').style.display = 'flex';
    }


    var cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjk4NDEyNDI1LCJzdWIiOiIxMzk1NDk4MC1hYjQwLTQwMTAtYThhZi02NmI5NWYyM2RlYmR-U1RBR0lOR34xOTcxMTQ2OC1jZTY3LTQ5OTgtYmQ5ZS0xNzAwNTRkYTk5NzgifQ.WzqacKQZQIh5SUMC7V45ndhVsk8jjI3BxiwhQVetkz4' })

    //V2 working here
    // var cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjk4NDEyNDI1LCJzdWIiOiIxMzk1NDk4MC1hYjQwLTQwMTAtYThhZi02NmI5NWYyM2RlYmR-U1RBR0lOR34xOTcxMTQ2OC1jZTY3LTQ5OTgtYmQ5ZS0xNzAwNTRkYTk5NzgifQ.WzqacKQZQIh5SUMC7V45ndhVsk8jjI3BxiwhQVetkz4' }, (container) =>
    //     container.provides(
    //         Injectable(
    //             remoteApiServicesFactory.token,
    //             [remoteApiServicesFactory.token],
    //             (existing) => [...existing, damsService]
    //         )
    //     )
    // );




    const session = await cameraKit.createSession();
    // document.getElementById('canvas').replaceWith(session.output.live);
    // const canvasContainer = document.getElementById("canvas-container");
    let canvas = session.output.live;
    document.body.appendChild(canvas);


    const { lenses } = await cameraKit.lensRepository.loadLensGroups(['a807b90b-4b77-4def-a142-495d0636d1f5']);
    session.applyLens(lenses[0], { mail: "launch@param.com" });
    // let mediaStream = await navigator.mediaDevices(getUserMedia({ video: true }));
    let mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'environment'
        }
    });
    const source = createMediaStreamSource(mediaStream, {
        // transform: Transform2D.MirrorX,
        fpsLimit: 30,
        cameraType: 'back',
    });
    await session.setSource(source)
    session.setSource(source)
    session.source.setRenderSize(window.innerWidth, window.innerHeight)
    session.play();

    //
    // console.log(session.output.live);
    // let ctx = session.output.live.getContext('webgl2');
    // console.log(ctx);

    const lowQuality = canvas.toDataURL("image/png", 0.1);
    let crop = canvas.toDataURL({
        format: 'png',
        left: 0,
        top: 0,
        width: 1,
        height: 1
    })
    var reader = new PNGReader(crop);
    reader.parse(function(err, png){
        if (err) throw err;
        console.log(png);
    });


})();