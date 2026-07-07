const audioCtx = typeof window !== "undefined" ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function sleep(ms: number) 
{
  return new Promise((res) => setTimeout(res, ms));
}

function playBeep(duration: number) 
{
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();

  setTimeout(() => osc.stop(), duration);
}

export async function playMorse(morse: string) 
{
  const DOT = 100;
  const DASH = DOT * 3;

  for (const char of morse) 
  {
    if (char === ".") 
    {
      playBeep(DOT);
      await sleep(DOT);
    } 
    else if (char === "-") 
    {
      playBeep(DASH);
      await sleep(DASH);
    } 
    else 
    {
      await sleep(DOT * 3);
    }

    await sleep(DOT);
  }
}