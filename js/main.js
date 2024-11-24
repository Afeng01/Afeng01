document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');
    const comparisonSection = document.getElementById('comparisonSection');

    let originalFile = null;

    // 点击上传区域触发文件选择
    dropZone.addEventListener('click', () => fileInput.click());

    // 处理文件拖放
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007AFF';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ddd';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ddd';
        const files = e.dataTransfer.files;
        if (files.length) handleFile(files[0]);
    });

    // 处理文件选择
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    // 处理质量滑块变化
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (originalFile) compressImage(originalFile);
    });

    // 处理文件
    function handleFile(file) {
        if (!file.type.match('image.*')) {
            alert('请选择图片文件！');
            return;
        }

        originalFile = file;
        comparisonSection.style.display = 'block';
        
        // 显示原始图片
        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            originalSize.textContent = formatFileSize(file.size);
            compressImage(file);
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                canvas.toBlob(
                    (blob) => {
                        compressedPreview.src = URL.createObjectURL(blob);
                        compressedSize.textContent = formatFileSize(blob.size);
                        
                        // 设置下载按钮
                        downloadBtn.onclick = () => {
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = `compressed_${file.name}`;
                            link.click();
                        };
                    },
                    'image/jpeg',
                    qualitySlider.value / 100
                );
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 