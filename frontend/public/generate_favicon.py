from PIL import Image, ImageDraw


def draw_logo(size: int) -> Image.Image:
    bg = (9, 70, 52)        # #094634
    fg = (247, 248, 246)    # #F7F8F6

    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # rounded background
    radius = int(size * 0.25)
    draw.rounded_rectangle((0, 0, size, size), radius=radius, fill=bg)

    # left and right circles
    cx1 = int(size * 0.35)
    cx2 = int(size * 0.65)
    cy = int(size * 0.5)
    r = int(size * 0.15)
    draw.ellipse((cx1 - r, cy - r, cx1 + r, cy + r), fill=fg)
    draw.ellipse((cx2 - r, cy - r, cx2 + r, cy + r), fill=fg)

    # connecting rectangle (same color as background)
    x = int(size * 0.35)
    y = int(size * 0.425)
    w = int(size * 0.30)
    h = int(size * 0.15)
    draw.rectangle((x, y, x + w, y + h), fill=bg)

    return img


if __name__ == "__main__":
    base = draw_logo(512)

    # favicon.ico with multiple sizes
    sizes = [16, 32, 48, 64]
    icons = [base.resize((s, s), Image.Resampling.LANCZOS) for s in sizes]
    base.resize((32, 32), Image.Resampling.LANCZOS).save(
        "favicon.ico", format="ICO", sizes=[(s, s) for s in sizes]
    )

    # apple touch icon
    base.resize((180, 180), Image.Resampling.LANCZOS).save("apple-touch-icon.png")

    print("Favicon files generated.")
