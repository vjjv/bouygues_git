import {
    bootstrapCameraKit,
    createMediaStreamSource,
    Transform2D,
    Injectable,
    RemoteApiService,
    RemoteApiServices,
    RemoteApiRequest,
    RemoteApiRequestHandler,
    RemoteApiStatus,
    remoteApiServicesFactory,
    Push2Web,

} from '@snap/camera-kit'

(async function () {




    //DAMS
    const damsService = {
        apiSpecId: "87e3aee3-0a82-4fbd-8d71-b4534c79704c",

        getRequestHandler(request) {
            if (request.endpointId !== "codemail") return;


            return (reply) => {
                fetch(`https://bouygues-404412.lm.r.appspot.com/codemail?code=${request.parameters.code}&mail=${request.parameters.mail}`, {
                    headers: {
                        Accept: "application/json",
                    },
                })
                    .then((res) => res.text())
                    .then((res) =>
                        reply({
                            status: "success",
                            metadata: {},
                            body: new TextEncoder().encode(res),
                        })
                    );
            };
        },
    };

   


    //var cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjk4NDEyNDI1LCJzdWIiOiIxMzk1NDk4MC1hYjQwLTQwMTAtYThhZi02NmI5NWYyM2RlYmR-U1RBR0lOR34xOTcxMTQ2OC1jZTY3LTQ5OTgtYmQ5ZS0xNzAwNTRkYTk5NzgifQ.WzqacKQZQIh5SUMC7V45ndhVsk8jjI3BxiwhQVetkz4' })

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

    //PUSH2WEB
    const push2Web = new Push2Web();
    push2Web.events.addEventListener("lensReceived", console.info);
    push2Web.events.addEventListener("error", console.error);
    push2Web.events.addEventListener("subscriptionChanged", console.info);

    const extensions = (container) => container.provides(push2Web.extension, damsService);

    const cameraKit = await bootstrapCameraKit({ apiToken: "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjk4NDEyNDI1LCJzdWIiOiIxMzk1NDk4MC1hYjQwLTQwMTAtYThhZi02NmI5NWYyM2RlYmR-U1RBR0lOR34xOTcxMTQ2OC1jZTY3LTQ5OTgtYmQ5ZS0xNzAwNTRkYTk5NzgifQ.WzqacKQZQIh5SUMC7V45ndhVsk8jjI3BxiwhQVetkz4" }, extensions);
    //const cameraKitSession = await cameraKit.createSession();

    push2Web.subscribe("login kit access token", cameraKitSession, cameraKit.lensRepository);
    //end PUSH2WEB

    const session = await cameraKit.createSession();

    document.getElementById('canvas').replaceWith(session.output.live);

    // const { lenses } = await cameraKit.lensRepository.loadLensGroups(['1c840cc0-bead-4a6d-8328-1fbe4a5ba67a']);
    const { lenses } = await cameraKit.lensRepository.loadLensGroups(['a807b90b-4b77-4def-a142-495d0636d1f5']);

    session.applyLens(lenses[0]);


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



})()