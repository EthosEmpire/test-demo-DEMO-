/* ============================================================
   ETHOS EMPIRE — PILLAR-FX.JS  (fixed)
   Pillar section canvas animations.
   Each runs on a perfectly seamless 20-second loop.
   Canvases are transparent — matrix background shows through.

   Sections:
     #discipline-anim  → Brain neuron network
     #confidence-anim  → 3D colour-cycling icosahedron
   ============================================================ */
(function () {
  'use strict';

  const LOOP = 20000;
  const TAU  = Math.PI * 2;

  /* ──────────────────────────────────────────────────────────
     SHARED: Deterministic seeded hash  →  sr(seed) = 0…1
     Named "sr" (seeded random) to avoid any naming conflict
     with local canvas-height variables named "H".
     ────────────────────────────────────────────────────────── */
  function sr(n) {
    n  = (n ^ 0xDEADBEEF) >>> 0;
    n  = Math.imul(n ^ (n >>> 16), 0x45d9f3b) >>> 0;
    n  = Math.imul(n ^ (n >>> 16), 0x45d9f3b) >>> 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  }

  /* ──────────────────────────────────────────────────────────
     SHARED: 3-D rotation helpers
     ────────────────────────────────────────────────────────── */
  function rx(p,a){return{x:p.x,y:p.y*Math.cos(a)-p.z*Math.sin(a),z:p.y*Math.sin(a)+p.z*Math.cos(a)};}
  function ry(p,a){return{x:p.x*Math.cos(a)+p.z*Math.sin(a),y:p.y,z:-p.x*Math.sin(a)+p.z*Math.cos(a)};}
  function rz(p,a){return{x:p.x*Math.cos(a)-p.y*Math.sin(a),y:p.x*Math.sin(a)+p.y*Math.cos(a),z:p.z};}

  /* ============================================================
     ANIMATION 1 — DISCIPLINE
     Brain neuron network: nodes fire, pulses travel, axons glow.
     ============================================================ */
  function startDiscipline(wrap) {
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const NUM_N = 34;
    const NUM_P = 60;

    /* canvas dimensions — named cW/cH to avoid any conflict */
    let cW, cH, scene;

    /* Bezier curve helpers */
    function ctrlPt(ax,ay,bx,by,cv){
      const mx=(ax+bx)*.5,my=(ay+by)*.5,dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy)||1;
      return{x:mx+(-dy/len)*len*cv, y:my+(dx/len)*len*cv};
    }
    function bezPt(ax,ay,bx,by,cv,t){
      const c=ctrlPt(ax,ay,bx,by,cv),u=1-t;
      return{x:u*u*ax+2*u*t*c.x+t*t*bx, y:u*u*ay+2*u*t*c.y+t*t*by};
    }
    function bezPath(ax,ay,bx,by,cv){
      const c=ctrlPt(ax,ay,bx,by,cv);
      ctx.moveTo(ax,ay); ctx.quadraticCurveTo(c.x,c.y,bx,by);
    }

    /* Node colour lookup */
    const NCOLS={
      cyan:  {r:0,  g:200,b:255,glow:'#00CCFF'},
      blue:  {r:30, g:120,b:255,glow:'#1E78FF'},
      purple:{r:160,g:60, b:255,glow:'#AA3CFF'},
    };

    /* Build all scene data — uses sr() for seeded randomness */
    function buildScene(){
      const types=['cyan','blue','purple'];
      const nodes=Array.from({length:NUM_N},(_,i)=>{
        const isHub=sr(i*19+1)>.72;
        return{
          bx:cW*(.30+sr(i*7)*.65), by:cH*(.07+sr(i*7+1)*.86),
          dax:(sr(i*7+2)-.5)*26,   day:(sr(i*7+3)-.5)*26,
          dpx:sr(i*7+4)*TAU,       dpy:sr(i*7+5)*TAU,
          dfx:1+Math.floor(sr(i*7+6)*3),
          dfy:1+Math.floor(sr(i*13+2)*3),
          r:isHub?7+sr(i*3)*5:3+sr(i*3+1)*4,
          isHub, type:types[Math.floor(sr(i*31+7)*3)],
          x:0, y:0, activation:0,
        };
      });

      const MAX=Math.min(cW,cH)*.30;
      const edges=[];
      nodes.forEach((a,i)=>nodes.forEach((b,j)=>{
        if(i>=j)return;
        const d=Math.hypot(a.bx-b.bx,a.by-b.by);
        if(d<MAX) edges.push({i,j,d,curve:(sr((i+1)*(j+3)*17)-.5)*.42,activity:0});
      }));

      const pulses=Array.from({length:NUM_P},(_,p)=>{
        const ei=Math.floor(sr(p*11+3)*edges.length);
        const fwd=sr(p*13+5)>.5;
        return{
          edge:edges[ei],
          src:fwd?edges[ei].i:edges[ei].j,
          dst:fwd?edges[ei].j:edges[ei].i,
          startT:sr(p*17+7)*LOOP,
          duration:650+sr(p*19+9)*1500,
          brightness:.65+sr(p*23+11)*.35,
        };
      });

      return{nodes,edges,pulses};
    }

    function drawNode(n){
      const c=NCOLS[n.type],act=n.activation;
      if(act>.04){
        const gr=ctx.createRadialGradient(n.x,n.y,n.r*.5,n.x,n.y,n.r*(4+act*5));
        gr.addColorStop(0,`rgba(${c.r},${c.g},${c.b},${(act*.38).toFixed(3)})`);
        gr.addColorStop(1,`rgba(${c.r},${c.g},${c.b},0)`);
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r*(4+act*5),0,TAU);
        ctx.fillStyle=gr; ctx.fill();
      }
      const hR=n.r*2.2;
      const ha=ctx.createRadialGradient(n.x,n.y,n.r,n.x,n.y,hR);
      ha.addColorStop(0,`rgba(${c.r},${c.g},${c.b},${(.07+act*.2).toFixed(3)})`);
      ha.addColorStop(1,`rgba(${c.r},${c.g},${c.b},0)`);
      ctx.beginPath(); ctx.arc(n.x,n.y,hR,0,TAU); ctx.fillStyle=ha; ctx.fill();

      ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,TAU);
      ctx.fillStyle=`rgba(${c.r},${Math.min(255,c.g+Math.round(act*55))},${c.b},${(.55+act*.45).toFixed(2)})`;
      ctx.shadowBlur=8+act*20; ctx.shadowColor=c.glow; ctx.fill(); ctx.shadowBlur=0;

      if(n.isHub){
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r*.38,0,TAU);
        ctx.fillStyle=`rgba(220,240,255,${(.28+act*.72).toFixed(2)})`; ctx.fill();
      }
    }

    function drawEdge(e){
      const a=scene.nodes[e.i],b=scene.nodes[e.j];
      const alpha=.05+(a.activation+b.activation)*.06+e.activity*.28;
      ctx.beginPath(); bezPath(a.x,a.y,b.x,b.y,e.curve);
      if(e.activity>.08){
        ctx.strokeStyle=`rgba(0,170,255,${Math.min(.82,alpha+e.activity*.28).toFixed(3)})`;
        ctx.shadowBlur=6+e.activity*12; ctx.shadowColor='#0099FF';
      } else {
        ctx.strokeStyle=`rgba(35,80,200,${alpha.toFixed(3)})`; ctx.shadowBlur=0;
      }
      ctx.lineWidth=.75+e.activity*1.6; ctx.globalAlpha=1; ctx.stroke(); ctx.shadowBlur=0;
    }

    function drawPulse(px,py,br){
      const bl=ctx.createRadialGradient(px,py,0,px,py,11);
      bl.addColorStop(0,  `rgba(160,230,255,${(br*.85).toFixed(2)})`);
      bl.addColorStop(.35,`rgba(0,180,255,${(br*.45).toFixed(2)})`);
      bl.addColorStop(1,  'rgba(0,80,200,0)');
      ctx.beginPath(); ctx.arc(px,py,11,0,TAU);
      ctx.fillStyle=bl; ctx.shadowBlur=18; ctx.shadowColor='#00DDFF'; ctx.fill();
      ctx.beginPath(); ctx.arc(px,py,2.4,0,TAU);
      ctx.fillStyle=`rgba(255,255,255,${br.toFixed(2)})`;
      ctx.shadowBlur=12; ctx.shadowColor='#FFF'; ctx.fill(); ctx.shadowBlur=0;
    }

    function setup(){
      cW=canvas.width=wrap.offsetWidth||window.innerWidth;
      cH=canvas.height=wrap.offsetHeight||window.innerHeight;
      scene=buildScene();
    }
    let rt; window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(setup,180);});
    setup();

    function frame(ts){
      if(!scene){requestAnimationFrame(frame);return;}
      const T=ts%LOOP,tf=T/LOOP;
      const {nodes,edges,pulses}=scene;
      ctx.clearRect(0,0,cW,cH);

      /* Background atmosphere */
      const pulse=.5+.5*Math.sin(tf*TAU);
      const ag=ctx.createRadialGradient(cW*.65,cH*.5,0,cW*.65,cH*.5,Math.min(cW,cH)*(.28+.06*pulse));
      ag.addColorStop(0,`rgba(55,18,175,${(.05+.025*pulse).toFixed(3)})`);
      ag.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=ag; ctx.fillRect(0,0,cW,cH);

      nodes.forEach(n=>{
        n.x=n.bx+n.dax*Math.sin(tf*TAU*n.dfx+n.dpx);
        n.y=n.by+n.day*Math.cos(tf*TAU*n.dfy+n.dpy);
        n.activation=0;
      });
      edges.forEach(e=>{e.activity=0;});

      const live=[];
      pulses.forEach(p=>{
        const el=(T-p.startT+LOOP)%LOOP,fd=450;
        if(el>p.duration+fd)return;
        const inT=el<=p.duration,prog=inT?el/p.duration:1;
        if(inT){
          nodes[p.src].activation=Math.max(nodes[p.src].activation,Math.max(0,1-prog*2.5)*.55);
          nodes[p.dst].activation=Math.max(nodes[p.dst].activation,Math.pow(prog,1.8)*p.brightness);
          p.edge.activity=Math.max(p.edge.activity,Math.sin(prog*Math.PI)*p.brightness);
          live.push({p,prog});
        } else {
          nodes[p.dst].activation=Math.max(nodes[p.dst].activation,(1-(el-p.duration)/fd)*p.brightness);
        }
      });

      ctx.lineCap='round';
      edges.forEach(drawEdge);
      live.forEach(({p,prog})=>{
        const a=nodes[p.src],b=nodes[p.dst];
        const pt=bezPt(a.x,a.y,b.x,b.y,p.edge.curve,prog);
        drawPulse(pt.x,pt.y,p.brightness);
      });
      nodes.forEach(drawNode);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ============================================================
     ANIMATION 2 — CONFIDENCE
     3D icosahedron with full-spectrum colour cycling.
     ============================================================ */
  function startConfidence(wrap) {
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const phi = (1 + Math.sqrt(5)) / 2;

    /* Icosahedron vertices & faces */
    const IVERTS=[
      [0,1,phi],[0,-1,phi],[0,1,-phi],[0,-1,-phi],
      [1,phi,0],[-1,phi,0],[1,-phi,0],[-1,-phi,0],
      [phi,0,1],[-phi,0,1],[phi,0,-1],[-phi,0,-1]
    ].map(v=>{const l=Math.hypot(v[0],v[1],v[2]);return{x:v[0]/l,y:v[1]/l,z:v[2]/l};});

    const IFACES=[
      [0,1,8],[0,8,4],[0,4,5],[0,5,9],[0,9,1],
      [3,10,2],[3,2,11],[3,11,7],[3,7,6],[3,6,10],
      [1,6,8],[8,6,10],[8,10,4],[4,10,2],[4,2,5],
      [5,2,11],[5,11,9],[9,11,7],[9,7,1],[1,7,6]
    ];

    /* Octahedron vertices & faces */
    const OVERTS=[
      {x:0,y:1,z:0},{x:0,y:-1,z:0},{x:1,y:0,z:0},
      {x:-1,y:0,z:0},{x:0,y:0,z:1},{x:0,y:0,z:-1}
    ];
    const OFACES=[
      [0,2,4],[0,4,3],[0,3,5],[0,5,2],
      [1,4,2],[1,3,4],[1,5,3],[1,2,5]
    ];

    /* Orbiting triangle fragments — sr() for seeded positions */
    const ORBITERS=Array.from({length:12},(_,i)=>({
      radFrac:.26+sr(i*7)*.22,
      speed:1+Math.floor(sr(i*7+1)*3),
      phase:sr(i*7+2)*TAU,
      tiltX:(sr(i*7+3)-.5)*1.4,
      tiltZ:(sr(i*7+4)-.5)*1.0,
      sizeFrac:.025+sr(i*7+5)*.032,
      hOff:sr(i*7+6)*360,
      spinSpd:1+Math.floor(sr(i*7+7)*4),
    }));

    /* Floating dust particles — sr() for seeded positions */
    const DUST=Array.from({length:28},(_,i)=>({
      xFrac:.15+sr(i*11+1)*.7,
      spd:1+Math.floor(sr(i*11+2)*3),
      ph:sr(i*11+3),
      r:1+sr(i*11+4)*2.2,
      hOff:sr(i*11+5)*360,
    }));

    /* Canvas dimensions — named cW/cH to avoid any conflict */
    let cW, cH, CX, CY, FOV, ZDIST, icoScale, octScale;

    function setup(){
      cW=canvas.width=wrap.offsetWidth||window.innerWidth;
      cH=canvas.height=wrap.offsetHeight||window.innerHeight;
      CX=cW*.62; CY=cH*.5;
      const m=Math.min(cW,cH);
      FOV=m*1.5; ZDIST=m*.55; icoScale=m*.25; octScale=m*.11;
    }
    let rt; window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(setup,180);});
    setup();

    function proj(p){const s=FOV/(FOV+p.z+ZDIST);return{x:CX+p.x*s,y:CY+p.y*s,s};}

    function drawPoly(verts,faces,angY,angX,angZ,scale,hueBase){
      const tv=verts.map(v=>{
        let p={x:v.x*scale,y:v.y*scale,z:v.z*scale};
        p=rx(p,angX); p=ry(p,angY); p=rz(p,angZ);
        return{raw:p,pr:proj(p)};
      });
      const fd=faces.map((f,i)=>{
        const v0=tv[f[0]].raw,v1=tv[f[1]].raw,v2=tv[f[2]].raw;
        const e1={x:v1.x-v0.x,y:v1.y-v0.y,z:v1.z-v0.z};
        const e2={x:v2.x-v0.x,y:v2.y-v0.y,z:v2.z-v0.z};
        let nx=e1.y*e2.z-e1.z*e2.y,ny=e1.z*e2.x-e1.x*e2.z,nz=e1.x*e2.y-e1.y*e2.x;
        const nl=Math.hypot(nx,ny,nz)||1; nx/=nl;ny/=nl;nz/=nl;
        const isFront=nz>=0;
        const diffuse=Math.max(0,.45*nz+.3*ny-.25*nx);
        return{f,tv,depth:(v0.z+v1.z+v2.z)/3,diffuse,isFront,
          hue:(hueBase+i*(360/faces.length))%360};
      });
      fd.sort((a,b)=>a.depth-b.depth);
      fd.forEach(d=>{
        const p0=d.tv[d.f[0]].pr,p1=d.tv[d.f[1]].pr,p2=d.tv[d.f[2]].pr;
        ctx.beginPath();
        ctx.moveTo(p0.x,p0.y); ctx.lineTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.closePath();
        ctx.fillStyle=`hsla(${d.hue.toFixed(1)},${d.isFront?92:60}%,${(d.isFront?28+d.diffuse*38:10).toFixed(1)}%,${(d.isFront?.72+d.diffuse*.24:.08).toFixed(3)})`;
        ctx.fill();
        if(d.isFront){
          ctx.strokeStyle=`hsla(${d.hue.toFixed(1)},100%,72%,0.55)`;
          ctx.lineWidth=.9; ctx.shadowBlur=10; ctx.shadowColor=`hsl(${d.hue.toFixed(1)},100%,65%)`;
          ctx.stroke(); ctx.shadowBlur=0;
        }
      });
    }

    function drawOrbiters(tf,gh){
      ORBITERS.forEach(o=>{
        const a=tf*TAU*o.speed+o.phase;
        let pos={x:Math.cos(a)*o.radFrac*icoScale*3.8,y:0,z:Math.sin(a)*o.radFrac*icoScale*3.8};
        pos=rx(pos,o.tiltX); pos=rz(pos,o.tiltZ);
        const pr=proj(pos);
        const hue=(gh+o.hOff)%360,sz=o.sizeFrac*Math.min(cW,cH)*pr.s;
        const sa=tf*TAU*o.spinSpd+o.phase;
        ctx.beginPath();
        for(let k=0;k<3;k++){
          const ka=sa+k*TAU/3;
          k===0
            ?ctx.moveTo(pr.x+Math.cos(ka)*sz,pr.y+Math.sin(ka)*sz)
            :ctx.lineTo(pr.x+Math.cos(ka)*sz,pr.y+Math.sin(ka)*sz);
        }
        ctx.closePath();
        ctx.fillStyle=`hsla(${hue.toFixed(1)},95%,58%,0.55)`;
        ctx.shadowBlur=14; ctx.shadowColor=`hsl(${hue.toFixed(1)},100%,65%)`; ctx.fill();
        ctx.strokeStyle=`hsla(${hue.toFixed(1)},100%,78%,0.7)`; ctx.lineWidth=.8; ctx.stroke();
        ctx.shadowBlur=0;
      });
    }

    function drawEnergyRing(tf,gh){
      const N=36,ringR=icoScale*1.35,tilt=.42,ringA=tf*TAU;
      ctx.lineWidth=1.2;
      for(let i=0;i<N;i++){
        const a0=ringA+(i/N)*TAU,a1=ringA+((i+.7)/N)*TAU;
        const hue=(gh+i*(360/N))%360,bright=.5+.5*Math.sin(a0*3+tf*TAU*2);
        ctx.beginPath();
        ctx.moveTo(CX+Math.cos(a0)*ringR,CY+Math.sin(a0)*ringR*Math.cos(tilt));
        ctx.lineTo(CX+Math.cos(a1)*ringR,CY+Math.sin(a1)*ringR*Math.cos(tilt));
        ctx.strokeStyle=`hsla(${hue.toFixed(1)},100%,65%,${(.25+bright*.45).toFixed(3)})`;
        ctx.shadowBlur=8; ctx.shadowColor=`hsl(${hue.toFixed(1)},100%,60%)`; ctx.stroke();
        ctx.shadowBlur=0;
      }
    }

    function drawDust(tf,gh){
      DUST.forEach(d=>{
        const progress=(tf*d.spd+d.ph)%1;
        const fade=progress<.06?progress/.06:progress>.9?(1-progress)/.1:1;
        if(fade<.01)return;
        const y=CY+cH*.45-progress*cH*1.3;
        const hue=(gh+d.hOff)%360,pulse=.7+.3*Math.sin(tf*TAU*d.spd*3+d.ph*TAU);
        ctx.beginPath(); ctx.arc(cW*d.xFrac,y,d.r*pulse,0,TAU);
        ctx.fillStyle=`hsla(${hue.toFixed(1)},95%,65%,${(fade*.75).toFixed(3)})`;
        ctx.shadowBlur=8; ctx.shadowColor=`hsl(${hue.toFixed(1)},100%,65%)`; ctx.fill();
        ctx.shadowBlur=0;
      });
    }

    function frame(ts){
      const T=ts%LOOP,tf=T/LOOP,a=tf*TAU;
      const gh=tf*360;
      ctx.clearRect(0,0,cW,cH);

      /* Atmosphere matches current hue */
      const pulse=.5+.5*Math.sin(tf*TAU);
      const ag=ctx.createRadialGradient(CX,CY,icoScale*.05,CX,CY,icoScale*(1.6+.2*pulse));
      ag.addColorStop(0,`hsla(${gh},80%,25%,${(.1+.03*pulse).toFixed(3)})`);
      ag.addColorStop(.55,`hsla(${gh},60%,15%,0.04)`);
      ag.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=ag; ctx.fillRect(0,0,cW,cH);

      drawEnergyRing(tf,gh);
      drawPoly(OVERTS,OFACES,-a*2,a,0,octScale,(gh+180)%360);
      drawPoly(IVERTS,IFACES,a,.44,0,icoScale,gh);
      drawOrbiters(tf,gh);
      drawDust(tf,gh);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function init() {
    const d = document.getElementById('discipline-anim');
    const c = document.getElementById('confidence-anim');
    if (d) startDiscipline(d);
    if (c) startConfidence(c);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();