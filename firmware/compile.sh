mkdir build 2>>/dev/null;
sdcc -mmcs51 --out-fmt-ihx --std-c99 -o build/ firmware.c;
cp -a upload.sh build/
