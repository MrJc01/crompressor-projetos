package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"syscall/js"
)

// -- Simulação temporária do Engine Interno do CROM
// Para a versão de produção chamaremos github.com/MrJc01/crompressor/core
func simulatePack(input []byte) ([]byte, string) {
	// Dummy logic: Hash it and gzip it conceptually
	// Em vez de importar compress/gzip no teste, faremos um mock de compressão run-length simplório
	output := make([]byte, 0, len(input))
	if len(input) == 0 {
		return output, "empty"
	}
	hash := sha256.Sum256(input)
	output = append(output, []byte("CROM")...)
	output = append(output, hash[:]...)
	output = append(output, input...) // Aqui seria zlib/LSH
	return output, hex.EncodeToString(hash[:])
}

// packWrapper exporta a compressão CROM para o JavaScript
func packWrapper(this js.Value, args []js.Value) interface{} {
	if len(args) == 0 {
		return js.ValueOf("Error: No data provided")
	}

	jsArray := args[0]
	length := jsArray.Get("length").Int()
	inBuf := make([]byte, length)
	js.CopyBytesToGo(inBuf, jsArray)

	// Roda o Engine
	outBuf, hash := simulatePack(inBuf)

	// Converte para JS
	jsOutBuf := js.Global().Get("Uint8Array").New(len(outBuf))
	js.CopyBytesToJS(jsOutBuf, outBuf)

	// Retorna um objeto com dados e metadados
	res := js.Global().Get("Object").New()
	res.Set("data", jsOutBuf)
	res.Set("hash", hash)
	res.Set("originalSize", length)
	res.Set("cromSize", len(outBuf))
	return res
}

func main() {
	fmt.Println("🚀 Crompressor WASM Core Iniciado com Sucesso!")

	js.Global().Set("cromPack", js.FuncOf(packWrapper))

	// Bloqueia para manter o WASM vivo
	select {}
}
