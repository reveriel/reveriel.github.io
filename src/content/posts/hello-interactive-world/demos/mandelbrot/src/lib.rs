use wasm_bindgen::prelude::*;

/// Compute Mandelbrot iterations for a single point.
/// Returns the iteration count (capped at max_iter).
fn mandelbrot(cx: f64, cy: f64, max_iter: u32) -> u32 {
    let mut x = 0.0;
    let mut y = 0.0;
    let mut iter = 0;
    while x * x + y * y <= 4.0 && iter < max_iter {
        let xt = x * x - y * y + cx;
        y = 2.0 * x * y + cy;
        x = xt;
        iter += 1;
    }
    iter
}

/// HSV → RGB helper for coloring the fractal.
fn hsv_to_rgb(h: f64, s: f64, v: f64) -> (u8, u8, u8) {
    let c = v * s;
    let hp = h / 60.0;
    let x = c * (1.0 - ((hp % 2.0) - 1.0).abs());
    let (r1, g1, b1) = match hp as u32 {
        0 => (c, x, 0.0),
        1 => (x, c, 0.0),
        2 => (0.0, c, x),
        3 => (0.0, x, c),
        4 => (x, 0.0, c),
        _ => (c, 0.0, x),
    };
    let m = v - c;
    (
        ((r1 + m) * 255.0) as u8,
        ((g1 + m) * 255.0) as u8,
        ((b1 + m) * 255.0) as u8,
    )
}

/// Render the Mandelbrot set into a byte buffer (RGBA).
/// Returns a Vec<u8> of length width * height * 4.
#[wasm_bindgen]
pub fn render(
    width: u32,
    height: u32,
    center_x: f64,
    center_y: f64,
    zoom: f64,
    max_iter: u32,
) -> Vec<u8> {
    let scale = 4.0 / zoom; // zoom level → viewport size in complex plane
    let aspect = width as f64 / height as f64;
    let x_min = center_x - scale * aspect / 2.0;
    let y_min = center_y - scale / 2.0;
    let dx = scale * aspect / width as f64;
    let dy = scale / height as f64;

    let size = (width * height * 4) as usize;
    let mut pixels = vec![0u8; size];

    for py in 0..height {
        let cy = y_min + py as f64 * dy;
        for px in 0..width {
            let cx = x_min + px as f64 * dx;
            let iter = mandelbrot(cx, cy, max_iter);
            let idx = ((py * width + px) * 4) as usize;

            if iter == max_iter {
                // In the set — black
                pixels[idx] = 0;
                pixels[idx + 1] = 0;
                pixels[idx + 2] = 0;
                pixels[idx + 3] = 255;
            } else {
                // Outside — color by iteration count
                let t = iter as f64 / max_iter as f64;
                let hue = (t * 360.0 + 200.0) % 360.0;
                let (r, g, b) = hsv_to_rgb(hue, 0.8, 0.9);
                pixels[idx] = r;
                pixels[idx + 1] = g;
                pixels[idx + 2] = b;
                pixels[idx + 3] = 255;
            }
        }
    }

    pixels
}
