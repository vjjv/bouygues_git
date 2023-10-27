import {
    bootstrapCameraKit,
    createMediaStreamSource,
    Transform2D,
} from '@snap/camera-kit'

(async function () {

    var cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjk3MDExNzE0LCJzdWIiOiI2MjZiMGU1OC1hM2E2LTQ5ZDgtODQzYS0zYjBkNDk2YmQwNWJ-U1RBR0lOR342ZDFkMWQwNy05YTEzLTQ5N2EtOWE3NS00ODk4ZjgzMzRhN2IifQ.nPVzJXx_O65xLPd2GwmmbsZD8YHvRIgPsHjMtbmfZNs' })

    const session = await cameraKit.createSession();

    document.getElementById('canvas').replaceWith(session.output.live);

    const { lenses } = await cameraKit.lensRepository.loadLensGroups(['1c840cc0-bead-4a6d-8328-1fbe4a5ba67a']);

    session.applyLens(lenses[3]); 

    
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