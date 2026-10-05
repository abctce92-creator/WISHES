import html2canvas from 'html2canvas';

export const exportCardAsImage = async (
  cardElement: HTMLElement | null,
  fileName: string = 'Happy_Birthday_Amma_Revathi.png'
) => {
  if (!cardElement) return;

  try {
    // Render at 2x resolution for crisp high-DPI print/share quality
    const canvas = await html2canvas(cardElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('Failed to export card image:', err);
  }
};
