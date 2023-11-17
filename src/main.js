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

} from '@snap/camera-kit';


(async function () {




    //DAMS
    const damsService = {
        apiSpecId: "87e3aee3-0a82-4fbd-8d71-b4534c79704c",

        getRequestHandler(request) {
            if (request.endpointId !== "prize") return;


            return (reply) => {
                fetch(`https://bouygues-404412.lm.r.appspot.com/prize?mail=${request.parameters.mail}`, {
                    headers: {
                        Accept: "application/json",
                    },
                })
                    .then((res) => {res.text(); console.log('ha');res.text()})
                    .then((res) => {      
                        reply({
                            status: "success",
                            metadata: {},
                            body: new TextEncoder().encode(res),
                        })
                        carton(res.text());
                    })
            };
        },
    };

    function carton(res) {
        document.getElementById('carton').style.display = 'block';
        console.log(typeof(res));
        console.log('carton, res:');
        console.log(res);
        console.log('carton, res.json():')
        console.log(res.json());
    }


    //var cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjk4NDEyNDI1LCJzdWIiOiIxMzk1NDk4MC1hYjQwLTQwMTAtYThhZi02NmI5NWYyM2RlYmR-U1RBR0lOR34xOTcxMTQ2OC1jZTY3LTQ5OTgtYmQ5ZS0xNzAwNTRkYTk5NzgifQ.WzqacKQZQIh5SUMC7V45ndhVsk8jjI3BxiwhQVetkz4' })

    //V2 working here
    var cameraKit = await bootstrapCameraKit({ apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjk4NDEyNDI1LCJzdWIiOiIxMzk1NDk4MC1hYjQwLTQwMTAtYThhZi02NmI5NWYyM2RlYmR-U1RBR0lOR34xOTcxMTQ2OC1jZTY3LTQ5OTgtYmQ5ZS0xNzAwNTRkYTk5NzgifQ.WzqacKQZQIh5SUMC7V45ndhVsk8jjI3BxiwhQVetkz4' }, (container) =>
        container.provides(
            Injectable(
                remoteApiServicesFactory.token,
                [remoteApiServicesFactory.token],
                (existing) => [...existing, damsService]
            )
        )
    );




    const session = await cameraKit.createSession();
    document.getElementById('canvas').replaceWith(session.output.live);
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



})();