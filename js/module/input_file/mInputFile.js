/**
 * The input-file module that can show selected-file
 * v2.0
 * @author Caro.Huang
 */

/**
 * OPT
 * maxLength: int (default: 0) - the max-length can select,0 is no limit
 * maxSize: int (default: 0) - the max-file-size allows to select
 * maxTotalSize: int (default: 0) - the total-max-file-size allows to select
 *
 * DOM
 * dFileRuleMsg
 * dFileStatusMsg
 * dInputFileTable
 * dInputFileCover
 * dInputFileCleanBtn
 * dSelectedFileList
 *
 * FN
 * cleanInputFile: clean selected file
 * highLightStatusMsg: highLight File-Status-Msg
 * lowLightStatusMsg: set File-Status-Msg to original type
 * @param opt
 * @returns {$.fn}
 */
$.fn.mInputFile = function (opt) {
    var self = this;
    var originalFileList = [];
    var aRemovedIndex = [];
    var inputFileItems = [];
    var rejectType = '';
    var maxLength = 0;
    var maxSize = 0;
    var maxTotalSize = 0;
    if (opt) {
        maxLength = (opt.maxLength > 0) ? opt.maxLength : maxLength;
        maxSize = (opt.maxSize > 0) ? opt.maxSize : maxSize;
        maxTotalSize = (opt.maxTotalSize > 0 && opt.maxTotalSize > maxSize) ? opt.maxTotalSize : maxTotalSize;
    }
    var setFileItemIndexAndColor = function () {
        $.each(inputFileItems, function (i, dInputFileItem) {
            i = dInputFileItem.index();
            if (i % 2 === 0) {
                dInputFileItem
                    .removeClass('text-success')
                    .lClass('text-primary');
            } else {
                dInputFileItem
                    .removeClass('text-primary')
                    .lClass('text-success');
            }
            dInputFileItem.dInputFileIndex.html(i + 1 + '.');
        });
    };
    var highLightStatusMsg = function () {
        dFileStatusMsg
            .lClass('alert-danger')
            .removeClass('alert-warning');
    };
    var lowLightStatusMsg = function () {
        dFileStatusMsg
            .lClass('alert-warning')
            .removeClass('alert-danger');
    };
    var hideFileStatusMsg = function () {
        dFileStatusMsg.fadeOut(function () {
            lowLightStatusMsg();
        });
    };
    var cleanInputFile = function () {
        originalFileList = [];
        aRemovedIndex = [];
        inputFileItems = [];
        dSelectedFileList.empty();
        hideFileStatusMsg();
    };
    var getFileList = function () {
        var newInputFiles = [];
        $.each(originalFileList, function (i, oFile) {
            // push to new file list if the index is not to be removed
            if (aRemovedIndex.indexOf(i) < 0) {
                newInputFiles.push(oFile);
            }
        });
        if (newInputFiles.length < 1) {
            return null;
        }
        return newInputFiles;
    };
    var checkRuleAndShowFileStatus = function (fileList) {
        var fileSizeTotal = 0;
        var aOverSizeFileName = [];
        var fileLength = fileList.length;
        if (!fileLength) {
            return true;
        }
        rejectType = '';
        if (maxLength && fileLength > maxLength) {
            rejectType = 'maxLength';
        }
        $.each(fileList, function (i, oFileDetail) {
            var fileSize = oFileDetail.size;
            var fileName = oFileDetail.name;
            if (maxSize && fileSize > maxSize) {
                aOverSizeFileName.push(fileName);
                rejectType = 'maxSize';
            }
            fileSizeTotal += fileSize;
            return true;
        });
        if (maxTotalSize && fileSizeTotal > maxTotalSize) {
            rejectType = 'maxTotalSize';
        }
        dFileStatusMsg.setFileStatusMsg(fileLength, fileSizeTotal, aOverSizeFileName);
        if (rejectType) {
            highLightStatusMsg();
            return false;
        }
        lowLightStatusMsg();
        return true;
    };
    var dFileRuleMsg = (function () {
        var inputFileRuleMsg = $('<div></div>')
            .lClass('inputFileRuleMsg form-control alert-info')
            .css({
                height: 'auto'
            });
        var ifShowRuleMsg = false;
        var dInputFileMsgSpanFn = function () {
            return $('<span></span>')
                .lClass('inputFileMsgSpan')
                .css({
                    'padding-right': 5
                });
        };
        if (maxLength) {
            var maxLengthMsgSpan = dInputFileMsgSpanFn();
            ifShowRuleMsg = true;
            setMaxLengthMsg();
            inputFileRuleMsg
                .append(maxLengthMsgSpan);
            $.lEventEmitter.hookEvent('aftSwitchLang', 'mInputFile', setMaxLengthMsg, {
                source: maxLengthMsgSpan
            });
            function setMaxLengthMsg() {
                var msg = $.lLang.parseLanPath('mInputFile.maxLengthMsg');
                msg = msg(maxLength);
                maxLengthMsgSpan.html(msg);
            }
        }
        if (maxSize) {
            var maxSizeMsgSpan = dInputFileMsgSpanFn();
            ifShowRuleMsg = true;
            setMaxSizeMsg();
            inputFileRuleMsg
                .append(maxSizeMsgSpan);
            $.lEventEmitter.hookEvent('aftSwitchLang', 'mInputFile', setMaxSizeMsg, maxSizeMsgSpan);
            function setMaxSizeMsg() {
                var msg = $.lLang.parseLanPath('mInputFile.maxSizeMsg');
                msg = msg(maxSize);
                maxSizeMsgSpan.html(msg);
            }
        }
        if (maxTotalSize) {
            var maxTotalSizeMsgSpan = dInputFileMsgSpanFn();
            ifShowRuleMsg = true;
            setMaxTotalSizeMsg();
            inputFileRuleMsg
                .append(maxTotalSizeMsgSpan);
            $.lEventEmitter.hookEvent('aftSwitchLang', 'mInputFile', setMaxTotalSizeMsg, maxTotalSizeMsgSpan);
            function setMaxTotalSizeMsg() {
                var msg = $.lLang.parseLanPath('mInputFile.maxTotalSizeMsg');
                msg = msg(maxTotalSize);
                maxTotalSizeMsgSpan.html(msg);
            }
        }
        if (ifShowRuleMsg) {
            return inputFileRuleMsg;
        }
        return inputFileRuleMsg.hide();
    })();
    var dFileStatusMsg = (function () {
        var dFileStatusMsg = $('<div></div>')
            .lClass('inputFileStatusMsg form-control alert-warning')
            .css({
                height: 'auto'
            });
        var dInputFileStatusMsgSpanFn = function () {
            return $('<span></span>')
                .lClass('inputFileStatusMsgSpan')
                .css({
                    'padding-right': 5
                });
        };
        var setFileLengthMsg = function (fileLength) {
            var maxTotalSizeMsgSpan = dInputFileStatusMsgSpanFn();
            var setMsg = function () {
                var msg = $.lLang.parseLanPath('mInputFile.fileLengthMsg');
                msg = msg(fileLength);
                maxTotalSizeMsgSpan.html(msg);
            };
            setMsg();
            dFileStatusMsg
                .append(maxTotalSizeMsgSpan);
            $.lEventEmitter.hookEvent('aftSwitchLang', 'mInputFile', setMsg, maxTotalSizeMsgSpan);
        };
        var setTotalSizeMsg = function (totalSize) {
            var totalSizeMsgSpan = dInputFileStatusMsgSpanFn();
            var setMsg = function () {
                var msg = $.lLang.parseLanPath('mInputFile.totalSizeMsg');
                msg = msg(totalSize);
                totalSizeMsgSpan.html(msg);
            };
            setMsg();
            dFileStatusMsg
                .append(totalSizeMsgSpan);
            $.lEventEmitter.hookEvent('aftSwitchLang', 'mInputFile', setMsg, totalSizeMsgSpan);
        };
        var setOverFileSizeMsg = function (aFileName) {
            if (!aFileName || aFileName.length < 1) {
                return;
            }
            var overFileSizeMsgSpan = dInputFileStatusMsgSpanFn();
            var setMsg = function () {
                var msg = $.lLang.parseLanPath('mInputFile.overSizeMsg');
                msg = msg(aFileName, maxSize);
                overFileSizeMsgSpan.html(msg);
            };
            setMsg();
            dFileStatusMsg
                .append(overFileSizeMsgSpan);
            $.lEventEmitter.hookEvent('aftSwitchLang', 'mInputFile', setMsg, overFileSizeMsgSpan);
        };
        dFileStatusMsg.setFileStatusMsg = function (fileLength, totalSize, aFileName) {
            dFileStatusMsg.empty().fadeIn();
            setFileLengthMsg(fileLength);
            setTotalSizeMsg(totalSize);
            setOverFileSizeMsg(aFileName);
        };
        return dFileStatusMsg.hide();
    })();
    var dInputFileTable = (function () {
        var dInputFileTable = $.lTable.createTable(1, 2);
        var dTd1 = dInputFileTable['col0-0'];
        var dTd2 = dInputFileTable['col0-1'];
        dInputFileTable
            .lClass('table table-borderless')
            .css({
                width: '100%',
                'margin-bottom': 0
            });
        dInputFileTable.dTd1 = dTd1;
        dInputFileTable.dTd2 = dTd2;
        return  dInputFileTable;
    })();
    var dInputFile = (function () {
        var dInputFile = $('<input>');
        dInputFile.lType('file')
            .attr('multiple', true)
            .lClass('inputFile form-control')
            .on('change.mInputFile', function (e) {
                var fileList = e.target.files;
                if (!checkRuleAndShowFileStatus(fileList)) {
                    return;
                }
                $.each(fileList, function (i, fileDetail) {
                    var dInputFileItem = (function (index) {
                        var fileName = fileDetail.name;
                        var fileSize = fileDetail.size;
                        var dInputFileIndex = (function () {
                            return $('<span></span>').lClass('inputFileIndex');
                        })();
                        var dInputFileName = (function () {
                            return  $('<span></span>').lClass('inputFileName').html(' ' + fileName + ' ');
                        })();
                        var dInputFileSize = (function () {
                            return  $('<span></span>')
                                .lClass('inputFileSize')
                                .html(' size: ' + fileSize + ' ')
                                .css({
                                    float: 'right'
                                });
                        })();
                        var dInputFileRemoveIcon = (function () {
                            return  $('<b></b>')
                                .lClass('dInputFileRemoveIcon')
                                .html('X')
                                .css({
                                    opacity: 0,
                                    float: 'right'
                                });
                        })();
                        var dInputFileItem = $('<div></div>')
                            .lClass('basic-link-bg basic-link inputFileItem')
                            .css({
                                'padding': 2
                            })
                            .append(dInputFileIndex)
                            .append(dInputFileName)
                            .append(dInputFileRemoveIcon)
                            .append(dInputFileSize)
                            .action('click.mInputFile', function () {
                                // add the index that want to be removed
                                aRemovedIndex.push(index);
                                var fileList = getFileList();
                                if (fileList) {
                                    checkRuleAndShowFileStatus(fileList);
                                } else {
                                    cleanInputFile();
                                }
                                dInputFileItem.fadeOut(function () {
                                    dInputFileItem.remove();
                                    setFileItemIndexAndColor();
                                });
                            })
                            .action('mouseenter.mInputFile', function () {
                                dInputFileRemoveIcon.css({
                                    opacity: 1
                                });
                            })
                            .action('mouseleave.mInputFile', function () {
                                dInputFileRemoveIcon.css({
                                    opacity: 0
                                });
                            });
                        dInputFileItem.find('span').css({
                            'padding-right': 5
                        });
                        dInputFileItem.dInputFileIndex = dInputFileIndex;
                        dInputFileItem.dInputFileName = dInputFileName;
                        return dInputFileItem;
                    })(i);
                    inputFileItems.push(dInputFileItem);
                    dSelectedFileList.append(dInputFileItem);
                });
                // set files to self
                originalFileList = fileList;
                setFileItemIndexAndColor();
            });
        return dInputFile;
    })();
    var dFixedHeightDiv = (function () {
        // used to fixed td-height
        return $('<div></div>');
    })();
    var dInputFileCover = (function () {
        var inputFileCover = $('<div></div>').lClass('inputFileCover');
        var dDescriptionSpan = $.lDom.createLangSpan('mInputFile.description');
        inputFileCover
            .lClass('form-control basic-color-gray basic-link')
            .append(dDescriptionSpan)
            .action('click.mInputFile', function () {
                cleanInputFile();
                dInputFile.trigger('click');
            });
        return inputFileCover;
    })();
    var dInputFileCleanBtn = (function () {
        var dClearBtn = $('<button></button>');
        dClearBtn
            .mBtn('clean')
            .lClass('button inputFileCleanBtn')
            .action('click.mInputFile', function () {
                cleanInputFile();
            });
        return dClearBtn;
    })();
    var dSelectedFileList = (function () {
        return $('<div></div>').lClass('dSelectedFileList');
    })();


    (function buildFrame() {
        self
            .empty()
            .append(dFileRuleMsg)
            .append(dInputFileTable)
            .append(dSelectedFileList)
            .append(dFileStatusMsg);
        dInputFileTable.dTd1.append(dFixedHeightDiv);
        dFixedHeightDiv
            .append(dInputFile)
            .append(dInputFileCover);
        dInputFileTable.dTd2
            .css({
                width: 1
            })
            .append(dInputFileCleanBtn);
    })();
    (function hideInputFile() {
        var inputFileHeight = dInputFile.outerHeight();
        dFixedHeightDiv
            .css({
                height: inputFileHeight,
                overflow: 'hidden'
            });

        dInputFileCover
            .css({
                position: 'relative',
                height: inputFileHeight,
                top: -(inputFileHeight)
            });

        dInputFile
            .css({
                opacity: 1
            });
    })();

    self.dFileRuleMsg = dFileRuleMsg;
    self.dFileStatusMsg = dFileStatusMsg;
    self.dInputFileTable = dInputFileTable;
    self.dInputFileCover = dInputFileCover;
    self.dInputFileCleanBtn = dInputFileCleanBtn;
    self.dSelectedFileList = dSelectedFileList;
    self.cleanInputFile = cleanInputFile;
    self.highLightStatusMsg = highLightStatusMsg;
    self.lowLightStatusMsg = lowLightStatusMsg;
    // replace origin jquery-function [val]
    self.val = getFileList;
    return self;
};