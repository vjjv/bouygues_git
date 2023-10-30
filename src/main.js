import {
    bootstrapCameraKit,
    createMediaStreamSource,
    Transform2D,
} from '@snap/camera-kit'

(async function () {

    var cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjk4NDEyNDI1LCJzdWIiOiIxMzk1NDk4MC1hYjQwLTQwMTAtYThhZi02NmI5NWYyM2RlYmR-UFJPRFVDVElPTn4xN2IzNWUzZC1iZWYwLTQxNzUtYTA2Ny05NTNiYmIyOGYyNTQifQ.tqyXjMntFKLnubtZailODeASvccrQziURDt1shDsznE' })

    const session = await cameraKit.createSession();

    document.getElementById('canvas').replaceWith(session.output.live);

    // const { lenses } = await cameraKit.lensRepository.loadLensGroups(['1c840cc0-bead-4a6d-8328-1fbe4a5ba67a']);
    const { lenses } = await cameraKit.lensRepository.loadLensGroups(['43fb2e8d-fe39-44fb-a043-11b46802c1a0']);

    session.applyLens(lenses[0]); 

    
    // let mediaStream = await navigator.mediaDevices(getUserMedia({ video: true }));
    let mediaStream = await navigator.mediaDevices.getUserMedia({ video: {
        facingMode: 'environment'
    } });

    const source = createMediaStreamSource(mediaStream, {
        // transform: Transform2D.MirrorX,
        cameraType: 'back'
    });



    await session.setSource(source)

    session.setSource(source)

    session.source.setRenderSize(window.innerWidth, window.innerHeight)

    session.play();



})()