## Floyd Steinberg Dithering

I have always had a fascination with image processing algorithms. Growing up, my family did not have the the most powerful computer of the current generation. When everyone was running [Windows 98](http://toastytech.com/guis/win98.html) on the latest [Internet Explorer](https://en.wikipedia.org/wiki/Internet_Explorer_5) browser, my family was still on [Windows 3.1](http://toastytech.com/guis/win31.html) and [Netscape Navigator 3](https://ei.marketwatch.com/Multimedia/2015/08/11/Photos/ZH/MW-DR908_netsca_20150811124153_ZH.jpg?uuid=df0a4148-4047-11e5-914a-0015c588e0f6). 

It sucked. My friends were playing the latest, and greatest online games like [Diablo 2](https://www.mobygames.com/game/diablo-ii), and [Half-Life](https://www.mobygames.com/game/windows/half-life), while the best I had was a bunch of [edutainment games](https://www.mobygames.com/game/chess-mates/screenshots), a [2D Rogue-like](https://www.mobygames.com/game/win3x/castle-of-the-winds), and a [Gameboy emulator](https://gbdev.gg8.se/wiki/articles/No$gmb) with a few ROMs. Up until I was able to build my own computer, I had always been using underpowered machines. 

I remember our first family machine, an [Intel 486 DX4](https://en.wikipedia.org/wiki/Intel_DX4), 100MHz system with a [VLB SVGA display adapter](https://www.vogonswiki.com/index.php/Trident_PM-V513). It was capable of displaying 16-bit color, but only at lower resolutions. We ran our computer on a 14" CRT, displaying at 256 colors. This system served as a family internet browsing machine up until 2001, when sharing digital photos over the web was starting to become more popular.

My monitor was showing colors from here:

![8 bit color](https://cdn.cambridgeincolour.com/images/tutorials/bitdepth_08bpp_580.png)

* *8 bit color depth. Source. https://www.cambridgeincolour.com/tutorials/bit-depth.htm*

While the rest of the world, was seeing colors in full 16-bit ("High Color")  glory!

![16-bit color depth](https://cdn.cambridgeincolour.com/images/tutorials/bitdepth_16bpp_580.png)

* *16-bit color depth Source. https://www.cambridgeincolour.com/tutorials/bit-depth.htm*



One of the earliest memories I had browsing the internet around this time was that photographs looked strange. A lot of the times they looked something like this:

![Posterization](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/user-interface/graphics/skiasharp/effects/color-filters-images/colorfiltersexample.png)

Even my 10 year old self knew that it was not how images were supposed to look like! Occasionally, I would come across images that looked like this on the same monitor! 

![Dithered](https://upload.wikimedia.org/wikipedia/commons/6/6d/Dithering_example_dithered_web_palette.png)

Wow! Much better! How could that be? 

It turns out that the latter had used [dithering](https://en.wikipedia.org/wiki/Dither). Dithering is a means to introduce noise to an image with a limited color space such that the final output has neighboring pixels whose colors are not too bright, or too dark from one another. This is a form of error distribution. If an image is not adjusted, then an image with limited colors will display [color banding](https://en.wikipedia.org/wiki/Colour_banding). 

## Why?

Why do we want to do this? Well, the most obvious benefit in reducing the color space of an image is that it allows the data to be represented with less bits. Less color information, means less bits needed, which ultimately leads to a smaller file size. 

This can result in:

* Being able to increase the spatial resolution for the image (the resolution of the image in pixels in $$W \times H$$)
* Being able to increase the temporal resolution for a video due to having a smaller file size per frame. (longer running time for a movie)

Depending on the file format chosen, the limited color palette can be substituted with a [color look-up table](https://en.wikipedia.org/wiki/Palette_(computing)), or CLUT, thereby allowing each pixel to be a single index value to that table.

With less color data to be stored resulting in smaller file sizes, this became handy for operating systems to make use of the display memory in the best way possible. This was especially handy for days where video memory was scarce. My first graphics adapter only had 1 MB of display memory.  Displaying 256 colors at 800 by 600 resolution, would have already occupied 480 KB of display memory. 