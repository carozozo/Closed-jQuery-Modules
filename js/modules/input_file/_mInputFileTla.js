/**
 * the l18n with form-checker module
 * @author Caro.Huang
 */


$.tLan.mInputFile = {};
$.tLan.mInputFile.en_us = {
    description: 'Please click to select files, or drag files to here.',
    maxLengthMsg: function (maxLength) {
        var msg = 'Can select max to ' + maxLength + ' file';
        if (maxLength > 1) {
            msg += 's';
        }
        msg += '.';
        return msg;
    },
    maxSizeMsg: function (maxSize) {
        return 'File size allows to ' + maxSize + ' each file.';
    },
    maxTotalSizeMsg: function (maxTotalSize) {
        return 'Total file size allows to ' + maxTotalSize + '.';
    },
    fileLengthMsg: function (fileLength) {
        var msg = 'You select ' + fileLength + ' file';
        if (fileLength > 1) {
            msg += 's';
        }
        msg += '.';
        return msg;
    },
    totalSizeMsg: function (totalSize) {
        return 'Totel file size ' + totalSize + '.';
    },
    overSizeMsg: function (aFileName, maxSize) {
        var fileLength = aFileName.length;
        if (fileLength > 1) {
            aFileName = fileLength + ' files are';
        } else {
            aFileName = '[ ' + aFileName[0] + '] is';
        }
        return aFileName + ' over ' + maxSize + '.';
    }
};

$.tLan.mInputFile.zh_tw = {
    description: '請點擊選取檔案，或將檔案拖曳至此.',
    maxLengthMsg: function (maxLength) {
        return '最多可選取' + maxLength + '個檔案.';
    },
    maxSizeMsg: function (maxSize) {
        return '每個檔案大小不超過' + maxSize + '.';
    },
    maxTotalSizeMsg: function (maxTotalSize) {
        return '全部檔案大小不超過' + maxTotalSize + '.';
    },
    fileLengthMsg: function (fileLength) {
        return '您選取了' + fileLength + '個檔案.';
    },
    totalSizeMsg: function (totalSize) {
        return '全部檔案大小' + totalSize + '.';
    },
    overSizeMsg: function (aFileName, maxSize) {
        var fileLength = aFileName.length;
        if (fileLength > 1) {
            aFileName = fileLength + '個檔案'
        } else {
            aFileName = '[ ' + aFileName[0] + ' ]';
        }
        return aFileName + ' 超過 ' + maxSize + '.';
    }
};

$.tLan.mInputFile.zh_cn = {
    description: '请点击选取文档，或将文档拖曳至此.',
    maxLengthMsg: function (maxLength) {
        return '最多可选取' + maxLength + '个文档.';
    },
    maxSizeMsg: function (maxSize) {
        return '每个文档大小不超过' + maxSize + '.';
    },
    maxTotalSizeMsg: function (maxTotalSize) {
        return '全部文档大小不超过' + maxTotalSize + '.';
    },
    fileLengthMsg: function (fileLength) {
        return '您选取了' + fileLength + '个文档.';
    },
    totalSizeMsg: function (totalSize) {
        return '全部文档大小' + totalSize + '.';
    },
    overSizeMsg: function (aFileName, maxSize) {
        var fileLength = aFileName.length;
        if (fileLength > 1) {
            aFileName = fileLength + '个文档'
        } else {
            aFileName = '[ ' + aFileName[0] + ' ]';
        }
        return aFileName + ' 超过 ' + maxSize + '.';
    }
};