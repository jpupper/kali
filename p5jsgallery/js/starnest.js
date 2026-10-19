/* Fondo: Star Nest (Kali) sobre three.js — mismo shader que la página del tributo */
(function () {
    var host = document.getElementById('shader-container');
    if (!host || typeof THREE === 'undefined') return;

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    host.appendChild(renderer.domElement);

    var fragmentShader = `
        uniform float time;
        uniform vec2 resolution;
        #define iterations 17
        #define formuparam 0.53
        #define volsteps 20
        #define stepsize 0.1
        #define zoom   0.800
        #define tile   0.850
        #define speed  0.010
        #define brightness 0.0015
        #define darkmatter 0.300
        #define distfading 0.730
        #define saturation 0.850
        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy - 0.5;
            uv.y *= resolution.y / resolution.x;
            vec3 dir = vec3(uv * zoom, 1.0);
            float a1 = 0.5 + time * 0.002;
            float a2 = 0.8 + time * 0.005;
            mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
            mat2 rot2 = mat2(cos(a2), sin(a2), -sin(a2), cos(a2));
            dir.xz *= rot1;
            dir.xy *= rot2;
            vec3 from = vec3(1.0, 0.5, 0.5);
            from += vec3(time * 0.001, time * 0.001, -2.0);
            from.xz *= rot1;
            from.xy *= rot2;
            float s = 0.1, fade = 1.0;
            vec3 v = vec3(0.0);
            for (int r = 0; r < volsteps; r++) {
                vec3 p = from + s * dir * 0.5;
                p = abs(vec3(tile) - mod(p, vec3(tile * 2.0)));
                float pa, a = pa = 0.0;
                for (int i = 0; i < iterations; i++) {
                    p = abs(p) / dot(p, p) - formuparam;
                    a += abs(length(p) - pa);
                    pa = length(p);
                }
                float dm = max(0.0, darkmatter - a * a * 0.001);
                a *= a * a;
                if (r > 6) fade *= 1.0 - dm;
                v += fade;
                v += vec3(s, s * s, s * s * s * s) * a * brightness * fade;
                fade *= distfading;
                s += stepsize;
            }
            v = mix(vec3(length(v)), v, saturation);
            gl_FragColor = vec4(v * 0.01, 1.0);
        }
    `;

    var uniforms = {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };
    var material = new THREE.ShaderMaterial({ uniforms: uniforms, fragmentShader: fragmentShader });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    function animate(t) {
        requestAnimationFrame(animate);
        uniforms.time.value = t / 1000;
        renderer.render(scene, camera);
    }
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    });
    animate();
})();
