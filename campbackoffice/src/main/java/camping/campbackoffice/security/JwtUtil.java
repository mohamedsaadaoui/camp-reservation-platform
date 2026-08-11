package camping.campbackoffice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        if (secret == null || secret.isBlank() || secret.length() < 32
                || secret.equalsIgnoreCase("camp-reservation-platform-jwt-secret-key-change-me-0123456789abcdef")) {
            throw new IllegalStateException(
                    "JWT_SECRET must be set to a strong secret of at least 32 characters. " +
                    "Do not use the example/default secret.");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public Claims parseToken(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public String getUsername(String token) {
        return parseToken(token).getSubject();
    }

    public String getRole(String token) {
        return parseToken(token).get("role", String.class);
    }

    public boolean isExpired(String token) {
        Date expiration = parseToken(token).getExpiration();
        return expiration == null || expiration.before(new Date());
    }
}
