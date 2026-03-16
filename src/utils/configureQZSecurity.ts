import qz from "qz-tray"

let qzSecurityConfigured = false

export function configureQZSecurity() {
  if (qzSecurityConfigured) return

  qz.security.setCertificatePromise((resolve, reject) => {
    fetch("/qz/digital-certificate.txt", {
      cache: "no-store",
      headers: {
        "Content-Type": "text/plain",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el certificado")
        return res.text()
      })
      .then(resolve)
      .catch(reject)
  })

  qz.security.setSignatureAlgorithm("SHA512")

  qz.security.setSignaturePromise((toSign) => {
    return (resolve, reject) => {
      fetch("/api/qz-sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: toSign }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("No se pudo firmar la solicitud")
          return res.text()
        })
        .then(resolve)
        .catch(reject)
    }
  })

  qzSecurityConfigured = true
}