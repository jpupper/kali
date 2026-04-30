// Three.js Shader Background
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('shader-container').appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2);

// A simplified version inspired by Kali's Star Nest
const fragmentShader = `
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
        
        //volumetric rendering
        float s = 0.1, fade = 1.0;
        vec3 v = vec3(0.0);
        for (int r = 0; r < volsteps; r++) {
            vec3 p = from + s * dir * 0.5;
            p = abs(vec3(tile) - mod(p, vec3(tile * 2.0))); // tiling fold
            float pa, a = pa = 0.0;
            for (int i = 0; i < iterations; i++) {
                p = abs(p) / dot(p, p) - formuparam; // the magic formula
                a += abs(length(p) - pa); // absolute sum of average change
                pa = length(p);
            }
            float dm = max(0.0, darkmatter - a * a * 0.001); //dark matter
            a *= a * a; // add contrast
            if (r > 6) fade *= 1.0 - dm; // dark matter, don't render near
            v += fade;
            v += vec3(s, s * s, s * s * s * s) * a * brightness * fade; // coloring based on distance
            fade *= distfading; // distance fading
            s += stepsize;
        }
        v = mix(vec3(length(v)), v, saturation); //color separation
        gl_FragColor = vec4(v * 0.01, 1.0);
    }
`;

const uniforms = {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
};

const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fragmentShader
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function animate(t) {
    requestAnimationFrame(animate);
    uniforms.time.value = t / 1000;
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
});

animate();

// Intersection Observer for reveal animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('.glass-card, .section-title').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)";
    observer.observe(el);
});

// Parallax Effect for Hero
window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    const profile = document.querySelector('.profile-container');
    if (profile) {
        profile.style.transform = `translate(${x}px, ${y}px)`;
    }
});
